import Path from "../components/Path";
import Input from "../components/Input";
import TextArea from "../components/TextArea";
import Select from "../components/Select";
import GreenLabel from "../components/StatusLabels/GreenLabel";
import GreyLabel from "../components/StatusLabels/GreyLabel";
import OrangeLabel from "../components/StatusLabels/OrangeLabel";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { PageContext } from "../context/PageContext";
import Toast from "../components/Toast";
import { API_URL } from '../config';

export default function AddProjectsPage() {
  const { productId } = useParams();
  const isEdit = !!productId;
  const DRAFT_KEY = isEdit ? `admin:editProductDraft:v1:${productId}` : "admin:addProductDraft:v1";
  const emptyProduct = () => ({
    availability: false,
    category: "",
    description: "",
    images: [],
    price: "",
    stock: "",
    title: "",
    slug: "",
    shortDescription: "",
    comparePrice: "",
    cost: "",
    trackInventory: true,
    lowStockThreshold: "",
    sku: "",
    chefSpecial: false,
    isFeatured: false,
    tags: [],
    metadata: {},
  });

  const [productType, setProductType] = useState("");
  const [departments, setDepartments] = useState([]);
  const [departmentFields, setDepartmentFields] = useState([]);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [productInfoExpanded, setProductInfoExpanded] = useState(true);
  const [organizationExpanded, setOrganizationExpanded] = useState(true);
  const [pricingExpanded, setPricingExpanded] = useState(false);
  const [inventoryExpanded, setInventoryExpanded] = useState(true);
  const [variantsExpanded, setVariantsExpanded] = useState(false);
  const [addonsExpanded, setAddonsExpanded] = useState(false);
  const [fieldTagInputs, setFieldTagInputs] = useState({}); // { [fieldKey]: string }
  const [product, setProduct] = useState(emptyProduct);
  const authToken = localStorage.getItem("token");
  const { changePage } = useContext(PageContext);
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState();
  const [categories, setCategories] = useState([]);
  const fileInputRef = useRef(null);
  const [variantGroups, setVariantGroups] = useState([]);
  const [addons, setAddons] = useState([]);
  const mainContentRef = useRef(null);
  const previewPanelRef = useRef(null);
  const [previewOpen, setPreviewOpen] = useState(true);
  const [previewPos, setPreviewPos] = useState({ x: 24, y: 24 });
  const [overlayBounds, setOverlayBounds] = useState(null); // { left, top, right, bottom }
  const [serverProductLoaded, setServerProductLoaded] = useState(!isEdit);
  const dragStateRef = useRef({
    dragging: false,
    pointerId: null,
    startLeft: 0,
    startTop: 0,
    startClientX: 0,
    startClientY: 0,
  });
  // Used to restore the originally loaded product when user clicks "Reset" in edit mode.
  const originalEditSnapshotRef = useRef(null);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/categories`)
      .then((res) => res.json())
      .then((json) => setCategories(json.data?.categories || []))
      .catch(() => setCategories([]));
  }, []);

  // Load product for edit mode
  useEffect(() => {
    if (!isEdit) {
      setServerProductLoaded(true);
      return;
    }
    setServerProductLoaded(false);
    let alive = true;
    (async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/products/${productId}`, {
          headers: { "Content-Type": "application/json" },
        });
        if (!alive) return;
        const p = res.data?.data?.product;
        if (!p) return;

        const categoryId =
          p.category && typeof p.category === "object" ? p.category._id ?? "" : p.category ?? "";
        const deptSlug =
          (p.department && typeof p.department === "object" ? p.department.slug : null) ||
          (p.category && typeof p.category === "object" ? (p.category.department?.slug || null) : null) ||
          "";

        const nextProduct = {
          ...emptyProduct(),
          ...p,
          category: String(categoryId || ""),
          price: p.price != null ? Number(p.price).toFixed(2) : "",
          comparePrice: p.comparePrice != null ? Number(p.comparePrice).toFixed(2) : "",
          cost: p.cost != null ? Number(p.cost).toFixed(2) : "",
          stock: p.stock != null ? String(Math.trunc(Number(p.stock))) : "",
          lowStockThreshold:
            p.lowStockThreshold != null ? String(Math.trunc(Number(p.lowStockThreshold))) : "",
          tags: Array.isArray(p.tags) ? p.tags : [],
          metadata: p.metadata && typeof p.metadata === "object" ? p.metadata : {},
        };

        setProductType(String(deptSlug || ""));
        setProduct(nextProduct);
        setVariantGroups(Array.isArray(p.variantGroups) ? p.variantGroups : []);
        setAddons(Array.isArray(p.addons) ? p.addons : []);
        setFiles(Array.isArray(p.images) ? p.images : []);

        // Snapshot of what the product was when it was loaded from the server.
        originalEditSnapshotRef.current = {
          product: nextProduct,
          productType: String(deptSlug || ""),
          variantGroups: Array.isArray(p.variantGroups) ? p.variantGroups : [],
          addons: Array.isArray(p.addons) ? p.addons : [],
          // For drafts we can restore image URL picks; File objects cannot be persisted.
          files: Array.isArray(p.images) ? p.images : [],
          tagInput: "",
          fieldTagInputs: {},
          previewOpen: true,
          previewPos: { x: 24, y: 24 },
        };
      } catch (e) {
        console.error("Failed to load product:", e);
        showToast("Error", "Failed to load product.", "warning");
      } finally {
        if (alive) setServerProductLoaded(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [isEdit, productId]);

  const showToast = (status, text, color) => {
    setMessage({ status, text, color });
  };

  const sanitizeIntegerString = (raw) => {
    const s = String(raw ?? "");
    const onlyDigits = s.replace(/[^\d]/g, "");
    // remove leading zeros but keep single 0
    const normalized = onlyDigits.replace(/^0+(?=\d)/, "");
    return normalized;
  };

  const sanitizeMoneyString = (raw) => {
    // digits + single dot, up to 2 dp
    const s = String(raw ?? "");
    const cleaned = s.replace(/[^\d.]/g, "");
    const firstDot = cleaned.indexOf(".");
    let out = cleaned;
    if (firstDot !== -1) {
      const before = cleaned.slice(0, firstDot);
      const after = cleaned.slice(firstDot + 1).replace(/\./g, "");
      out = `${before}.${after}`;
    }
    const parts = out.split(".");
    const intPart = parts[0] ?? "";
    const decPart = parts[1] ?? "";
    if (parts.length > 1) return `${intPart}.${decPart.slice(0, 2)}`;
    return intPart;
  };

  const formatMoney2dp = (value) => {
    const v = String(value ?? "").trim();
    if (v === "") return "";
    const n = Number(v);
    if (!Number.isFinite(n)) return "";
    return n.toFixed(2);
  };

  const validateBeforePublish = () => {
    const missingRequired = [];
    const errors = [];

    if (!productType) missingRequired.push("Department");
    if (!product.category) missingRequired.push("Category");
    if (!String(product.title || "").trim()) missingRequired.push("Product Name");
    if (String(product.price ?? "").trim() === "") missingRequired.push("Price");

    const price = product.price === "" ? NaN : Number(product.price);
    if (String(product.price ?? "").trim() !== "" && (!Number.isFinite(price) || price < 0)) {
      errors.push("Price must be a valid number.");
    }

    if (product.comparePrice !== "" && product.comparePrice != null) {
      const compare = Number(product.comparePrice);
      if (!Number.isFinite(compare) || compare < 0) errors.push("Compare Price must be a valid number.");
      else if (compare < price) errors.push("Compare Price can't be lower than Price.");
    }

    if (product.cost !== "" && product.cost != null) {
      const cost = Number(product.cost);
      if (!Number.isFinite(cost) || cost < 0) errors.push("Cost must be a valid number.");
    }

    if (product.trackInventory) {
      const stock = product.stock === "" ? 0 : Number(product.stock);
      if (!Number.isFinite(stock) || stock < 0 || !Number.isInteger(stock)) {
        errors.push("Stock Quantity must be a whole number.");
      }
      if (product.lowStockThreshold !== "" && product.lowStockThreshold != null) {
        const thr = Number(product.lowStockThreshold);
        if (!Number.isFinite(thr) || thr < 0 || !Number.isInteger(thr)) {
          errors.push("Low Stock Threshold must be a whole number.");
        } else if (Number.isFinite(stock) && Number.isInteger(stock) && thr > stock) {
          errors.push("Low Stock Threshold can't be greater than Stock Quantity.");
        }
      }
    }

    // Required department fields
    for (const f of departmentFields || []) {
      if (!f?.isRequired) continue;
      const v = product.metadata?.[f.fieldKey];
      const empty =
        v == null ||
        v === "" ||
        (Array.isArray(v) && v.length === 0);
      if (empty) errors.push(`${f.fieldLabel || f.fieldKey} is required.`);
    }

    // prep_time special rule
    if (productType === "food" && product.metadata?.prep_time !== "" && product.metadata?.prep_time != null) {
      const p = Number(product.metadata.prep_time);
      if (!Number.isFinite(p) || !Number.isInteger(p)) errors.push("Preparation time must be a whole number (minutes).");
      else if (p > 120) errors.push("Preparation time must be 120 minutes or less.");
      else if (p < 0) errors.push("Preparation time can't be negative.");
    }

    return { missingRequired, errors };
  };

  useEffect(() => {
    // Avoid a race where server-loaded data overwrites the restored draft.
    if (!serverProductLoaded) return;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return;

      let draftApplied = false;
      if (parsed.product && typeof parsed.product === "object") {
        setProduct((prev) => ({
          ...prev,
          ...parsed.product,
          metadata:
            parsed.product.metadata && typeof parsed.product.metadata === "object"
              ? parsed.product.metadata
              : prev.metadata,
          tags: Array.isArray(parsed.product.tags) ? parsed.product.tags : prev.tags,
        }));
        draftApplied = true;
      }
      setProductType(typeof parsed.productType === "string" ? parsed.productType : "");
      setVariantGroups(Array.isArray(parsed.variantGroups) ? parsed.variantGroups : []);
      setAddons(Array.isArray(parsed.addons) ? parsed.addons : []);
      setTagInput(typeof parsed.tagInput === "string" ? parsed.tagInput : "");
      setFieldTagInputs(parsed.fieldTagInputs && typeof parsed.fieldTagInputs === "object" ? parsed.fieldTagInputs : {});
      setPreviewOpen(!!parsed.previewOpen);
      if (
        parsed.previewPos &&
        typeof parsed.previewPos === "object" &&
        Number.isFinite(parsed.previewPos.x) &&
        Number.isFinite(parsed.previewPos.y)
      ) {
        setPreviewPos({ x: parsed.previewPos.x, y: parsed.previewPos.y });
      }

      // Restore image picks we persisted in the draft. (File objects can't be persisted.)
      if (Array.isArray(parsed.filesUrls)) {
        setFiles(parsed.filesUrls.filter((u) => typeof u === "string"));
      } else if (!isEdit) {
        // In add mode we clear file picks (draft doesn't contain them).
        setFiles([]);
      }

      if (draftApplied) {
        setMessage({
          status: "Draft Restored",
          text: isEdit ? "Draft loaded for this product." : "Draft loaded for a new product.",
          color: "success",
        });
      }
    } catch (_) {
      // If draft is corrupted, remove it to avoid breaking the page.
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch (_) {}
    }
  }, [DRAFT_KEY, isEdit, serverProductLoaded]);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/departments?isActive=true`)
      .then((res) => res.json())
      .then((json) => setDepartments(json.data?.departments || []))
      .catch(() => setDepartments([]));
  }, []);

  // useEffect(() => {
  //   if (!productType && departments.length > 0) {
  //     setProductType(departments[0].slug);
  //   }
  // }, [departments, productType]);

  useEffect(() => {
    setDetailsExpanded(true);
  }, [productType]);

  useEffect(() => {
    if (!productType) {
      setDepartmentFields([]);
      return;
    }
    fetch(`${API_URL}/api/v1/departments/${productType}/fields`)
      .then((res) => res.json())
      .then((json) => {
        const fields = json.data?.fields || [];
        setDepartmentFields(fields);

        setProduct((p) => {
          const nextMetadata = { ...(p.metadata || {}) };
          for (const f of fields) {
            if (nextMetadata[f.fieldKey] !== undefined) continue;
            if (f.defaultValue !== undefined) nextMetadata[f.fieldKey] = f.defaultValue;
            else if (f.fieldType === "tags") nextMetadata[f.fieldKey] = [];
            else nextMetadata[f.fieldKey] = "";
          }
          return { ...p, metadata: nextMetadata };
        });
      })
      .catch(() => setDepartmentFields([]));
  }, [productType]);

  useEffect(() => {
    // Reset category if it doesn't match the selected product type
    if (!product.category) return;
    const selected = categories.find((c) => c._id === product.category);
    if (!selected) return;
    const deptSlug =
      selected.department?.slug ||
      (selected.department?.name ? String(selected.department.name).toLowerCase() : "");
    if (deptSlug && deptSlug !== productType) {
      setProduct((p) => ({ ...p, category: "" }));
    }
  }, [productType, product.category, categories]);

  const setMetadataField = (key, value) => {
    setProduct((p) => ({
      ...p,
      metadata: {
        ...(p.metadata || {}),
        [key]: value,
      },
    }));
  };

  const handleAddFieldTag = (fieldKey) => {
    const raw = (fieldTagInputs[fieldKey] || "").trim();
    if (!raw) return;
    const current = Array.isArray(product.metadata?.[fieldKey])
      ? product.metadata[fieldKey]
      : [];
    if (current.includes(raw)) {
      setFieldTagInputs((s) => ({ ...s, [fieldKey]: "" }));
      return;
    }
    setMetadataField(fieldKey, [...current, raw]);
    setFieldTagInputs((s) => ({ ...s, [fieldKey]: "" }));
  };

  const handleRemoveFieldTag = (fieldKey, tag) => {
    const current = Array.isArray(product.metadata?.[fieldKey])
      ? product.metadata[fieldKey]
      : [];
    setMetadataField(
      fieldKey,
      current.filter((t) => t !== tag)
    );
  };

  const handleFileInputChange = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;
    setFiles((prev) => [...prev, ...selected]);
    e.target.value = "";
  };

  const handleRemoveFileAt = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const isValidURL = (str) => {
    if (typeof str !== "string") return false;
    return str.startsWith("http://") || str.startsWith("https://");
  };

  const imagePreviews = useMemo(() => {
    return (files || []).map((f) => {
      if (typeof f === "string") return { name: f.split("/").pop() || "image", url: f, revoke: false };
      return { name: f.name, url: URL.createObjectURL(f), revoke: true };
    });
  }, [files]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((p) => {
        if (p.revoke) URL.revokeObjectURL(p.url);
      });
    };
  }, [imagePreviews]);

  const handleInputChange = (field) => (e) => {
    setProduct({
      ...product,
      [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });
  };

  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setProduct((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (keyword) => {
    setProduct((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((item) => item !== keyword),
    }));
  };

  function handleSelectStatus(status) {
    setProduct({ ...product, availability: status == "Available" });
  }

  const step1Done = !!productType;
  const step2Done = step1Done && !!product.category;
  const requiredDeptFieldsDone = (departmentFields || [])
    .filter((f) => f && f.isRequired)
    .every((f) => {
      const v = product.metadata?.[f.fieldKey];
      if (Array.isArray(v)) return v.length > 0;
      if (typeof v === "number") return Number.isFinite(v);
      return v != null && String(v).trim() !== "";
    });
  const step3Done =
    step2Done &&
    !!String(product.title || "").trim() &&
    String(product.price ?? "").trim() !== "" &&
    requiredDeptFieldsDone;

  const addVariantGroup = () => {
    setVariantGroups((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: "",
        selectionType: "single",
        required: true,
        choices: [{ id: `${Date.now()}-c1`, name: "", priceDelta: "" }],
      },
    ]);
  };

  const updateVariantGroup = (id, patch) => {
    setVariantGroups((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  };

  const removeVariantGroup = (id) => {
    setVariantGroups((prev) => prev.filter((g) => g.id !== id));
  };

  const addVariantChoice = (groupId) => {
    setVariantGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              choices: [...g.choices, { id: `${Date.now()}-${Math.random()}`, name: "", priceDelta: "" }],
            }
          : g
      )
    );
  };

  const updateVariantChoice = (groupId, choiceId, patch) => {
    setVariantGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              choices: g.choices.map((c) => (c.id === choiceId ? { ...c, ...patch } : c)),
            }
          : g
      )
    );
  };

  const removeVariantChoice = (groupId, choiceId) => {
    setVariantGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              choices: g.choices.filter((c) => c.id !== choiceId),
            }
          : g
      )
    );
  };

  const addAddon = () => {
    setAddons((prev) => [...prev, { id: Date.now().toString(), name: "", price: "" }]);
  };

  const updateAddon = (id, patch) => {
    setAddons((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  };

  const removeAddon = (id) => {
    setAddons((prev) => prev.filter((a) => a.id !== id));
  };

  const uploadImages = async (images) => {
    if (!images || images.length === 0) {
      alert("Please select images to upload!");
      return [];
    }

    const uploadedImageUrls = [];

    for (const image of images) {
      if (typeof image === "string" && isValidURL(image)) {
        uploadedImageUrls.push(image);
        continue;
      }
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "my_unsigned_preset"); // Replace with your preset
      formData.append("cloud_name", "dvxcif0nt"); // Replace with your Cloudinary cloud name

      try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dvxcif0nt/image/upload",
          formData
        );
        uploadedImageUrls.push(response.data.secure_url);
        console.log("Image URL:", response.data.secure_url);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
    return uploadedImageUrls;
  };
  const handleSubmit = async () => {
    try {
      const res = validateBeforePublish();
      if (res.missingRequired.length > 0) {
        showToast("Missing required fields", res.missingRequired.join(", "), "warning");
        return;
      }
      if (res.errors.length > 0) {
        showToast("Validation", res.errors[0], "warning");
        return;
      }

      // Wait for the images to be uploaded and get their URLs
      const uploadedImageUrls = await uploadImages(files);

      // Update the product object with the uploaded image URLs
      const payload = {
        title: product.title,
        slug: product.slug || undefined,
        shortDescription: product.shortDescription || undefined,
        description: product.description || undefined,
        category: product.category,
        productType,
        price: Number(product.price) || 0,
        comparePrice:
          product.comparePrice === "" || product.comparePrice == null
            ? undefined
            : Number(product.comparePrice),
        cost:
          product.cost === "" || product.cost == null ? undefined : Number(product.cost),
        stock: Number(product.stock) || 0,
        trackInventory: !!product.trackInventory,
        lowStockThreshold:
          product.lowStockThreshold === "" || product.lowStockThreshold == null
            ? undefined
            : Number(product.lowStockThreshold),
        sku: product.sku || undefined,
        availability: !!product.availability,
        isFeatured: !!product.isFeatured,
        chefSpecial: !!product.chefSpecial,
        metadata: product.metadata && typeof product.metadata === "object" ? product.metadata : {},
        tags: product.tags || [],
        variantGroups,
        addons,
        images: uploadedImageUrls,
      };

      const response = isEdit
        ? await axios.patch(
            `${API_URL}/api/v1/products/${productId}`,
            JSON.stringify(payload),
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
            }
          )
        : await axios.post(
            `${API_URL}/api/v1/products`,
            JSON.stringify(payload),
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
            }
          );

      if (response.data.status === "success") {
        setMessage({
          status: "Success",
          text: isEdit ? "Product updated successfully!" : "Product added successfully!",
          color: "success",
        });
        try {
          localStorage.removeItem(DRAFT_KEY);
        } catch (_) {}
        if (!isEdit) {
          setProduct(emptyProduct());
          setProductType(departments[0]?.slug || "");
          setDepartmentFields([]);
          setFieldTagInputs({});
          setFiles([]);
          setTagInput("");
          setVariantGroups([]);
          setAddons([]);
        }
      }
    } catch (error) {
      console.error(isEdit ? "Error editing product:" : "Error adding product:", error);
      setMessage({
        status: "Error",
        text: isEdit ? "Error editing product" : "Error adding product",
        color: "warning",
      });
    }
  };

  const saveDraft = () => {
    try {
      const filesUrls = (files || []).filter((f) => typeof f === "string");
      const hasNonStringFiles = (files || []).some((f) => typeof f !== "string");
      const payload = {
        savedAt: new Date().toISOString(),
        product,
        productType,
        variantGroups,
        addons,
        tagInput,
        fieldTagInputs,
        previewOpen,
        previewPos,
        filesUrls,
        productId: isEdit ? productId : undefined,
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
      setMessage({
        status: "Draft Saved",
        text: hasNonStringFiles
          ? "Draft saved locally. Existing image URLs saved; newly picked files can't be restored."
          : "Draft saved locally. Existing image URLs saved.",
        color: "success",
      });
    } catch (e) {
      console.error("Failed to save draft:", e);
      setMessage({
        status: "Error",
        text: "Could not save draft (storage unavailable).",
        color: "warning",
      });
    }
  };

  const resetForm = () => {
    // In edit mode: restore the product exactly as it was when loaded from the server.
    if (isEdit && originalEditSnapshotRef.current) {
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch (_) {}

      const snap = originalEditSnapshotRef.current;
      setProduct(snap.product || emptyProduct());
      setProductType(snap.productType || "");
      setVariantGroups(snap.variantGroups || []);
      setAddons(snap.addons || []);
      setFiles(Array.isArray(snap.files) ? snap.files : []);
      setTagInput(typeof snap.tagInput === "string" ? snap.tagInput : "");
      setFieldTagInputs(snap.fieldTagInputs && typeof snap.fieldTagInputs === "object" ? snap.fieldTagInputs : {});
      setPreviewOpen(!!snap.previewOpen);
      setPreviewPos(snap.previewPos || { x: 24, y: 24 });
      return;
    }

    // In add mode: reset to blank state.
    setProduct(emptyProduct());
    setFiles([]);
    setTagInput("");
    setVariantGroups([]);
    setAddons([]);
    setFieldTagInputs({});
    setProductType("");
    setDepartmentFields([]);
    setPreviewOpen(false);
    setPreviewPos({ x: 24, y: 24 });
  };

  const clampPreviewPos = (x, y) => {
    const panel = previewPanelRef.current;
    if (!panel || !overlayBounds) return { x, y };
    const p = panel.getBoundingClientRect();
    const minX = overlayBounds.left + 8;
    const minY = overlayBounds.top + 8;
    const maxX = Math.max(minX, overlayBounds.right - p.width - 8);
    const maxY = Math.max(minY, overlayBounds.bottom - p.height - 8);
    return {
      x: Math.min(Math.max(minX, x), maxX),
      y: Math.min(Math.max(minY, y), maxY),
    };
  };

  const handlePreviewPointerDown = (e) => {
    if (!previewOpen) return;
    const panel = previewPanelRef.current;
    if (!panel) return;
    dragStateRef.current = {
      dragging: true,
      pointerId: e.pointerId,
      startLeft: previewPos.x,
      startTop: previewPos.y,
      startClientX: e.clientX,
      startClientY: e.clientY,
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!dragStateRef.current.dragging) return;
      const dx = e.clientX - dragStateRef.current.startClientX;
      const dy = e.clientY - dragStateRef.current.startClientY;
      const next = clampPreviewPos(dragStateRef.current.startLeft + dx, dragStateRef.current.startTop + dy);
      setPreviewPos(next);
    };

    const onUp = () => {
      if (!dragStateRef.current.dragging) return;
      dragStateRef.current.dragging = false;
      dragStateRef.current.pointerId = null;
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [previewPos.x, previewPos.y, previewOpen]);

  useEffect(() => {
    if (!previewOpen) return;
    setPreviewPos((p) => clampPreviewPos(p.x, p.y));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewOpen]);

  useEffect(() => {
    const updateBounds = () => {
      const el = mainContentRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setOverlayBounds({ left: r.left, top: r.top, right: r.right, bottom: r.bottom });
    };

    updateBounds();

    const onResize = () => {
      updateBounds();
      setPreviewPos((p) => clampPreviewPos(p.x, p.y));
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!overlayBounds) return;
    setPreviewPos((p) => clampPreviewPos(p.x, p.y));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overlayBounds]);

  const filteredCategories = categories.filter((cat) => {
    const deptSlug =
      cat.department?.slug ||
      (cat.department?.name ? String(cat.department.name).toLowerCase() : "");
    return deptSlug ? deptSlug === productType : true;
  });

  const selectedDepartment =
    departments.find((d) => d.slug === productType) || null;

  const categoryName =
    filteredCategories.find((c) => c._id === product.category)?.name || "";

  const priceNumber = Number(product.price) || 0;
  const compareNumber =
    product.comparePrice === "" || product.comparePrice == null
      ? null
      : Number(product.comparePrice);
  const showCompare =
    compareNumber != null && Number.isFinite(compareNumber) && compareNumber > priceNumber;

  const previewTags = [
    product.chefSpecial ? "Chef Special" : null,
    product.isFeatured ? "Featured" : null,
    showCompare ? "On Sale" : null,
  ].filter(Boolean);

  const requiredVariantSummaries = (variantGroups || [])
    .filter((g) => g && g.required)
    .map((g) => {
      const choice =
        (g.choices || []).find((c) => c && String(c.name || "").trim()) || null;
      const choiceName = choice ? String(choice.name || "").trim() : "";
      return choiceName ? choiceName : "";
    })
    .filter(Boolean);

  const variantsSummaryLine = requiredVariantSummaries.join(" • ");
  const showAddonsHint =
    !!selectedDepartment?.supportsVariants && Array.isArray(addons) && addons.length > 0;

  const prepTime =
    productType === "food" && product.metadata?.prep_time != null && product.metadata?.prep_time !== ""
      ? `${product.metadata.prep_time} min`
      : "";
  const unitSize =
    (productType === "grocery" || productType === "household") &&
    product.metadata?.unit_size != null &&
    String(product.metadata.unit_size).trim()
      ? String(product.metadata.unit_size).trim()
      : "";

  const metaParts = [categoryName || "Not set"];
  if (prepTime) metaParts.push(prepTime);
  if (unitSize) metaParts.push(unitSize);
  const metaLine = metaParts.filter(Boolean).join(" • ");

  const ProductTypeCard = ({ slug, title, subtitle, tone, iconUrl }) => {
    const active = productType === slug;
    const toneStyles = {
      green: {
        ring: "ring-[#16A34A]/50",
        bg: "bg-[#16A34A]",
        fbg: "bg-[#16A34A]/5",
        fg: "text-[#16A34A]",
      },
      blue: {
        ring: "ring-[#2563EB]/50",
        bg: "bg-[#2563EB]",
        fbg: "bg-[#2563EB]/5",
        fg: "text-[#2563EB]",
      },
      amber: {
        ring: "ring-[#D97706]/50",
        bg: "bg-[#D97706]",
        fbg: "bg-[#D97706]/5",
        fg: "text-[#D97706]",
      },
    }[tone];

    return (
      <button
        type="button"
        onClick={() => setProductType(slug)}
        className={[
          "group relative flex w-full items-center gap-3 rounded-[16px] border  px-5 py-3 text-left transition min-h-[84px]",
          active
            ? `border-[#78A67A] ${toneStyles.fbg} shadow-[0_2px_6px_rgba(17,24,39,0.06)] ring-1 ring-inset ` +
              toneStyles.ring
            : "border-[#E6E8EC] bg-[#FFFFFF] hover:border-[#D1D5DB] hover:shadow-[0_1px_3px_rgba(17,24,39,0.06)]",
        ].join(" ")}
      >
        <div
          className={[
            "flex h-16 w-16 items-center ",
          ].join(" ")}
        >
          {iconUrl ? (
            <img src={iconUrl} alt="" className=" object-contain h-16 w-16" />
          ) : (
            <span className={["text-[13px] font-bold", toneStyles.fg].join(" ")}>{title?.[0] || "D"}</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-[15px] leading-[20px] sm:text-[18px] sm:leading-[24px] font-semibold text-[#111827]">
            {title}
          </p>
          <p className="text-[12px] leading-[16px] sm:text-[14px] sm:leading-[20px] text-[#4B5563]">
            {subtitle}
          </p>
        </div>
        {active && (
          <div className="ml-auto">
            <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#6CA06E] ${toneStyles.bg} text-[20px] leading-none text-white transition absolute -right-2 -top-2 shadow-[0_1px_3px_rgba(17,24,39,0.2)]`}>
              ✓
            </span>
          </div>
        )}
        {active && (
          <span className={`absolute bottom-0 left-1/2 h-[4px] w-[48%] -translate-x-1/2 rounded-full ${toneStyles.bg}`} />
        )}
      </button>
    );
  };

  const renderDepartmentField = (field) => {
    const value = product.metadata?.[field.fieldKey];
    const label = `${field.fieldLabel}${field.isRequired ? " *" : ""}`;

    if (field.fieldType === "select") {
      const options = Array.isArray(field.options) ? field.options : [];
      return (
        <div key={field.fieldKey}>
          <p className="text-[#777980] font-bold text-[14px] leading-[20px] tracking-[0.005em]">
            {label}
          </p>
          <select
            className="mt-2 w-full rounded-lg border border-[#E5E7EB] bg-white py-2.5 px-3 text-[#111827] leading-[20px] focus:outline-none focus:ring-2 focus:ring-[#283618]/20"
            value={value ?? ""}
            onChange={(e) => setMetadataField(field.fieldKey, e.target.value)}
          >
            <option value="">{field.placeholder || "Select an option"}</option>
            {options.map((opt) => (
              <option key={opt.value ?? opt} value={opt.value ?? opt}>
                {opt.label ?? String(opt)}
              </option>
            ))}
          </select>
          {field.helpText && <p className="mt-1 text-[11px] text-[#6B7280]">{field.helpText}</p>}
        </div>
      );
    }

    if (field.fieldType === "number") {
      const isPrepTime = productType === "food" && field.fieldKey === "prep_time";
      return (
        <div key={field.fieldKey}>
          <Input
            label={label}
            placeholder={field.placeholder || ""}
            text={value ?? ""}
            hint={isPrepTime ? "Whole number only, max 120 minutes." : undefined}
            onInputChange={(e) => {
              const raw = e.target.value;
              const next = isPrepTime ? sanitizeIntegerString(raw) : raw;
              setMetadataField(field.fieldKey, next === "" ? "" : Number(next));
            }}
            onBlur={() => {
              if (!isPrepTime) return;
              const current = product.metadata?.[field.fieldKey];
              if (current === "" || current == null) return;
              let n = Number(current);
              if (!Number.isFinite(n)) {
                setMetadataField(field.fieldKey, "");
                showToast("Validation", "Preparation time must be a whole number (minutes).", "warning");
                return;
              }
              n = Math.trunc(n);
              if (n < 0) n = 0;
              if (n > 120) n = 120;
              if (n !== Number(current)) {
                showToast("Validation", "Preparation time must be an integer up to 120 minutes.", "warning");
              }
              setMetadataField(field.fieldKey, n);
            }}
            inputMode={isPrepTime ? "numeric" : undefined}
          />
          {field.helpText && <p className="mt-1 text-[11px] text-[#6B7280]">{field.helpText}</p>}
        </div>
      );
    }

    if (field.fieldType === "tags") {
      const tags = Array.isArray(value) ? value : [];
      return (
        <div key={field.fieldKey}>
          <p className="text-[#777980] font-bold text-[14px] leading-[20px] tracking-[0.005em]">
            {label}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="text"
              placeholder={field.placeholder || "Type and add"}
              value={fieldTagInputs[field.fieldKey] || ""}
              onChange={(e) =>
                setFieldTagInputs((s) => ({ ...s, [field.fieldKey]: e.target.value }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddFieldTag(field.fieldKey);
                }
              }}
              className="w-full rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2.5 text-[14px] font-semibold text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#283618]/20"
            />
            <button
              type="button"
              onClick={() => handleAddFieldTag(field.fieldKey)}
              className="shrink-0 rounded-lg bg-[#283618] px-4 py-2.5 text-[14px] font-semibold text-white hover:bg-[#1F2714]"
            >
              Add
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((t) => (
              <div key={t} className="flex items-center gap-2 rounded-full bg-[#F3F4F6] px-3 py-1.5">
                <span className="text-[13px] font-semibold text-[#111827]">{t}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFieldTag(field.fieldKey, t)}
                  className="text-[#6B7280] hover:text-[#111827]"
                  aria-label={`Remove ${t}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          {field.helpText && <p className="mt-1 text-[11px] text-[#6B7280]">{field.helpText}</p>}
        </div>
      );
    }

    return (
      <div key={field.fieldKey}>
        <Input
          label={label}
          placeholder={field.placeholder || ""}
          text={value ?? ""}
          onInputChange={(e) => setMetadataField(field.fieldKey, e.target.value)}
        />
        {field.helpText && <p className="mt-1 text-[11px] text-[#6B7280]">{field.helpText}</p>}
      </div>
    );
  };

  const SectionHeader = ({ title, expanded, onToggle, right }) => (
    <div className="flex items-center justify-between border-b border-[#E5E7EB] pl-5 pr-2 py-2">
      <p className="text-[16px] font-bold text-[#111827]">{title}</p>
      <div className="flex items-center gap-2">
        {right}
        <button
          type="button"
          onClick={onToggle}
          aria-label={expanded ? `Collapse ${title}` : `Expand ${title}`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#6B7280] hover:bg-[#F3F4F6]"
        >
          {expanded ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 14L12 9L17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Toast
        open={!!message}
        onClose={() => setMessage(undefined)}
        message={message?.text ?? ""}
        title={message?.status}
        type={message?.color === "success" ? "success" : "warning"}
        autoHideDuration={5000}
      />
      {changePage("products")}
      <div ref={mainContentRef} className="w-full max-w-none min-w-0 flex flex-col min-h-0">
        {/* Header (kept visible) */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between shrink-0">
          <div className="min-w-0">
            <p className="text-[#111827] font-bold text-[28px] leading-[36px] tracking-[0.01em]">
              {isEdit ? "Edit Product" : "Add New Product"}
            </p>
            <Path
              pages={[
                { name: "Products", link: "products" },
                { name: isEdit ? "Edit Product" : "Add Product", link: isEdit ? `edit-product/${productId}` : "add-products" },
              ]}
            />
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Link to={"/products"}>
              <button
                type="button"
                className="inline-flex items-center rounded-xl border border-[#D1D5DB] bg-white px-4 py-2.5 text-[14px] font-semibold text-[#374151] hover:border-[#9CA3AF] hover:bg-[#F9FAFB]"
              >
                Cancel
              </button>
            </Link>
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center rounded-xl border border-[#F0D2C8] bg-white px-4 py-2.5 text-[14px] font-semibold text-[#9B3B2F] hover:bg-[#FFF7F5]"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={saveDraft}
              className="inline-flex items-center rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-[14px] font-semibold text-[#374151] hover:bg-[#F9FAFB]"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center rounded-xl bg-[#283618] px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm hover:bg-[#1F2714]"
            >
              {isEdit ? "Update Product" : "Publish Product"}
            </button>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2 rounded-xl border border-[#E5E7EB] bg-white p-3 md:grid-cols-3">
          {[
            { key: 1, label: "Step 1: Department" },
            { key: 2, label: "Step 2: Category" },
            { key: 3, label: "Step 3: Details" },
          ].map((s) => (
            <button
              key={s.key}
              type="button"
              className={[
                "rounded-lg border px-3 py-2 text-left text-[13px] font-semibold transition",
                s.key === 1 && step1Done
                  ? "border-[#4B7D4F] bg-[#F2F7F2] text-[#1F2937]"
                  : s.key === 2 && step2Done
                    ? "border-[#4B7D4F] bg-[#F2F7F2] text-[#1F2937]"
                    : s.key === 3 && step3Done
                      ? "border-[#4B7D4F] bg-[#F2F7F2] text-[#1F2937]"
                      : "border-[#E5E7EB] bg-white text-[#6B7280]",
              ].join(" ")}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Scrollable form content */}
        <div className="relative flex-1 min-h-0 overflow-y-auto pr-2 mt-6">
          {/* Product type */}
          <div>
            <p className="text-[13px] font-semibold text-[#374151] mb-2">
              Product Type <span className="text-[#DC2626]">*</span>
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {departments.map((dept, idx) => {
                const tones = ["green", "blue", "amber"];
                const tone = tones[idx % tones.length];
                return (
                  <ProductTypeCard
                    key={dept._id || dept.slug}
                    slug={dept.slug}
                    title={`${dept.name} Item`}
                    subtitle={dept.description || "Department product type"}
                    tone={tone}
                    iconUrl={dept.iconUrl}
                  />
                );
              })}
            </div>
          </div>

          {/* Content grid */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 pb-8">
          {/* Left column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Product Information */}
            <div className="rounded-2xl  border border-[#E5E7EB] bg-white shadow-sm">
              <div className="flex pl-5 pr-2  py-2 items-center border-b border-[#E5E7EB]  justify-between">
                <p className="text-[16px] font-bold text-[#111827]">Basic Information</p>
                <div className="flex items-center gap-2">
                <button
                        type="button"
                        onClick={() =>
                          setProduct({
                            ...product,
                            availability: !product.availability,
                          })
                        }
                        className="inline-flex items-center text-[15px] font-medium"
                        aria-label={product.availability ? "Set inactive" : "Set active"}
                      >
                        <span
                          className={[
                            "inline-flex w-[96px] p-2  items-center justify-between rounded-full border transition",
                            product.availability
                              ? "border-[#4B7D4F] bg-[#039F0330] "
                              : "border-[#D1D5DB] bg-[#E5E7EB]",
                            product.availability ? "flex-row-reverse" : "flex-row",
                          ].join(" ")}
                        >
                          <span
                            className={`h-4 w-4 rounded-full  shadow-sm ${ product.availability ? "bg-[#1A9882]" : "bg-[#6B7280]"}`}
                          />
                          <span
                            className={[
                              "text-[13px] pl-1 font-semibold leading-none",
                              product.availability
                                ? "text-[#1A9882]"
                                : "text-[#6B7280]",
                            ].join(" ")}
                          >
                            {product.availability ? "Active" : "Inactive"}
                          </span>
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setProductInfoExpanded((v) => !v)}
                        aria-label={productInfoExpanded ? "Collapse product information" : "Expand product information"}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#6B7280] hover:bg-[#F3F4F6]"
                      >
                        {productInfoExpanded ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 14L12 9L17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                </div>
              </div>
              {productInfoExpanded && <div className="my-3 grid px-4 grid-cols-1 gap-5 lg:grid-cols-2">
                <div>
                  <p className="mb-2 text-[13px] font-semibold text-[#374151]">Product Image</p>
                  <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3">
                    <div className="overflow-hidden rounded-lg border border-[#E5E7EB] bg-white">
                      {imagePreviews[0] ? (
                        <img
                          src={imagePreviews[0].url}
                          alt="Product preview"
                          className="h-[130px] w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-[130px] items-center justify-center text-[12px] text-[#9CA3AF]">
                          No image selected
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileInputChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-[14px] font-semibold text-[#4B5563] hover:bg-[#F9FAFB]"
                      >
                        Upload Image
                      </button>
                      {imagePreviews.length > 0 && (
                        <span className="text-[12px] text-[#6B7280]">{imagePreviews.length} file(s)</span>
                      )}
                    </div>
                    {imagePreviews.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {imagePreviews.slice(0, 5).map((img, idx) => (
                          <div key={img.url} className="relative">
                            <img
                              src={img.url}
                              alt={img.name}
                              className="h-12 w-12 rounded-lg border border-[#D1D5DB] object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveFileAt(idx)}
                              className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-white text-[10px] text-[#6B7280] shadow"
                              aria-label={`Remove ${img.name}`}
                            >
                              x
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="text-[#777980] font-bold text-[14px] leading-[20px] tracking-[0.005em]">Tags</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(product.tags || []).map((v, idx) => (
                        <div
                          key={idx}
                          className={[
                            "flex items-center gap-2 rounded-full border px-3 py-1 text-[14px]",
                            idx % 3 === 0
                              ? "border-[#D1E9D2] bg-[#EEF8EE] text-[#4B7A4E]"
                              : idx % 3 === 1
                                ? "border-[#DCE7CC] bg-[#F2F7E9] text-[#5C6F44]"
                                : "border-[#F0D2C8] bg-[#FDEEE9] text-[#B25746]",
                          ].join(" ")}
                        >
                          <span>{v}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(v)}
                            className="text-[14px] leading-none text-[#8B8B8B]"
                          >
                            x
                          </button>
                        </div>
                      ))}
                      <div className="flex items-center rounded-full border border-[#E5E7EB] bg-white pr-2  pl-5 py-2">
                        <input
                          type="text"
                          placeholder="Add Tag"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddTag();
                            }
                          }}
                          className="w-[90px] bg-transparent text-[14px] border-none focus:border-none focus:ring-0 text-[#6B7280] outline-none placeholder:text-[#9CA3AF]"
                        />
                        <button
                          type="button"
                          onClick={handleAddTag}
                          className="ml-1 text-[18px] leading-none text-[#6B7280]"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <Input
                    label="Product Name"
                    placeholder="Type product name here"
                    text={product.title}
                    onInputChange={handleInputChange("title")}
                    required
                  />
                  <div className="mt-3" />
                  <Input
                    label="Slug"
                    placeholder="e.g spicy-alfredo-pasta"
                    text={product.slug}
                    onInputChange={handleInputChange("slug")}
                  />
                  <div className="mt-3" />
                  <Input
                    label="Short Description"
                    placeholder="One-line summary"
                    text={product.shortDescription}
                    onInputChange={handleInputChange("shortDescription")}
                  />
                  <div className="mt-3" />
                  <TextArea
                    label="Description"
                    placeholder="Type product description here"
                    text={product.description}
                    onInputChange={handleInputChange("description")}
                  />

                  
                </div>
              </div>}
            </div>

            {/* Organization */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
              <SectionHeader
                title="Organization"
                expanded={organizationExpanded}
                onToggle={() => setOrganizationExpanded((v) => !v)}
              />
              {organizationExpanded && (
                <div className="px-4 py-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                
                  {productType && (
                    <Select
                      label="Category"
                      placeholder="Select a category"
                      choices={filteredCategories.map((c) => ({ value: c._id, label: c.name }))}
                      value={product.category || ""}
                      handleOptionSelected={(id) => setProduct((p) => ({ ...p, category: id || "" }))}
                      required
                    />
                  )}
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
              <SectionHeader
                title="Pricing"
                expanded={pricingExpanded}
                onToggle={() => setPricingExpanded((v) => !v)}
              />
              {pricingExpanded && (
                <div className="px-4 py-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input
                    label="Price"
                    placeholder="0.00"
                    text={product.price}
                    hint="Numbers only. Locked to 2 decimals on blur."
                    onInputChange={(e) => {
                      const next = sanitizeMoneyString(e.target.value);
                      setProduct((p) => ({ ...p, price: next }));
                    }}
                    onBlur={() => {
                      const formatted = formatMoney2dp(sanitizeMoneyString(product.price));
                      if (product.price !== formatted) {
                        setProduct((p) => ({ ...p, price: formatted }));
                      }
                      // keep compare >= price
                      const price = Number(formatted || 0);
                      const compare = product.comparePrice === "" ? null : Number(product.comparePrice);
                      if (compare != null && Number.isFinite(compare) && compare < price) {
                        const nextCompare = price.toFixed(2);
                        showToast("Validation", "Compare Price can't be lower than Price.", "warning");
                        setProduct((p) => ({ ...p, comparePrice: nextCompare }));
                      }
                    }}
                    inputMode="decimal"
                    required
                  />
                  <Input
                    label="Compare Price"
                    placeholder="0.00"
                    text={product.comparePrice}
                    hint="Optional. Must be ≥ Price. Locked to 2 decimals on blur."
                    onInputChange={(e) => {
                      const next = sanitizeMoneyString(e.target.value);
                      setProduct((p) => ({ ...p, comparePrice: next }));
                    }}
                    onBlur={() => {
                      const formatted = formatMoney2dp(sanitizeMoneyString(product.comparePrice));
                      const price = Number(formatMoney2dp(sanitizeMoneyString(product.price)) || 0);
                      if (formatted !== "" && Number.isFinite(Number(formatted)) && Number(formatted) < price) {
                        showToast("Validation", "Compare Price can't be lower than Price.", "warning");
                        setProduct((p) => ({ ...p, comparePrice: price.toFixed(2) }));
                        return;
                      }
                      if (product.comparePrice !== formatted) {
                        setProduct((p) => ({ ...p, comparePrice: formatted }));
                      }
                    }}
                    inputMode="decimal"
                  />
                  <div className="sm:col-span-2">
                    <Input
                      label="Cost (optional)"
                      placeholder="0.00"
                      text={product.cost}
                      hint="Optional. Locked to 2 decimals on blur."
                      onInputChange={(e) => {
                        const next = sanitizeMoneyString(e.target.value);
                        setProduct((p) => ({ ...p, cost: next }));
                      }}
                      onBlur={() => {
                        const formatted = formatMoney2dp(sanitizeMoneyString(product.cost));
                        if (product.cost !== formatted) {
                          setProduct((p) => ({ ...p, cost: formatted }));
                        }
                      }}
                      inputMode="decimal"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Inventory */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
              <SectionHeader
                title="Inventory"
                expanded={inventoryExpanded}
                onToggle={() => setInventoryExpanded((v) => !v)}
              />
              {inventoryExpanded && (
                <div className="px-4 py-4">
                  <label className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#374151]">
                    <input
                      type="checkbox"
                      checked={!!product.trackInventory}
                      onChange={(e) => setProduct((p) => ({ ...p, trackInventory: e.target.checked }))}
                    />
                    Track Inventory
                  </label>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Input
                      label="Stock Quantity"
                      placeholder="0"
                      text={product.stock}
                      hint="Whole numbers only."
                      onInputChange={(e) => {
                        const next = sanitizeIntegerString(e.target.value);
                        setProduct((p) => ({ ...p, stock: next }));
                      }}
                      onBlur={() => {
                        const normalized = sanitizeIntegerString(product.stock);
                        if (product.stock !== normalized) setProduct((p) => ({ ...p, stock: normalized }));
                        if (normalized !== "" && String(normalized) !== String(product.stock)) {
                          showToast("Validation", "Stock Quantity must be a whole number.", "warning");
                        }
                        const stock = normalized === "" ? 0 : Number(normalized);
                        const thrRaw = sanitizeIntegerString(product.lowStockThreshold);
                        if (thrRaw !== "" && Number(thrRaw) > stock) {
                          showToast("Validation", "Low Stock Threshold can't be greater than Stock Quantity.", "warning");
                          setProduct((p) => ({ ...p, lowStockThreshold: String(stock) }));
                        }
                      }}
                      inputMode="numeric"
                    />
                    <Input
                      label="Low Stock Threshold"
                      placeholder="0"
                      text={product.lowStockThreshold}
                      hint="Whole numbers only. Must be ≤ Stock Quantity."
                      onInputChange={(e) => {
                        const next = sanitizeIntegerString(e.target.value);
                        setProduct((p) => ({ ...p, lowStockThreshold: next }));
                      }}
                      onBlur={() => {
                        const stock = sanitizeIntegerString(product.stock);
                        const thr = sanitizeIntegerString(product.lowStockThreshold);
                        if (product.lowStockThreshold !== thr) setProduct((p) => ({ ...p, lowStockThreshold: thr }));
                        const stockNum = stock === "" ? 0 : Number(stock);
                        const thrNum = thr === "" ? 0 : Number(thr);
                        if (thr !== "" && thrNum > stockNum) {
                          showToast("Validation", "Low Stock Threshold can't be greater than Stock Quantity.", "warning");
                          setProduct((p) => ({ ...p, lowStockThreshold: String(stockNum) }));
                        }
                      }}
                      inputMode="numeric"
                    />
                    <div className="sm:col-span-2">
                      <Input
                        label="SKU"
                        placeholder="Type SKU"
                        text={product.sku}
                        onInputChange={handleInputChange("sku")}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right column */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-4 self-start">
            {/* Department Details */}
            {departmentFields.length > 0 && (
              <div className="rounded-2xl border border-[#E5E7EB] bg-white  shadow-sm">
                <button
                  type="button"
                  onClick={() => setDetailsExpanded((v) => !v)}
                  className="flex w-full items-center justify-between text-left pl-5 pr-2 py-2 border-b border-[#E5E7EB]"
                  aria-label={detailsExpanded ? "Collapse details" : "Expand details"}
                >
                  <div>
                    <p className="text-[16px] font-bold text-[#111827]">
                      {selectedDepartment?.name || "Department"} Details
                    </p>
                     <p className="mt-2 text-[12px] text-[#6B7280]">
                      These fields are configured per department.
                    </p>
                  </div>
                  <span className="text-[#6B7280]">
                    {detailsExpanded ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 14L12 9L17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                </button>
                {detailsExpanded && (
                  <>
                
                    <div className="my-3 px-4 flex flex-col gap-4">
                      {departmentFields.map(renderDepartmentField)}
                    </div>
                  </>
                )}
              </div>
            )}

            {productType && (
              <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
                <SectionHeader
                  title="Variants"
                  expanded={variantsExpanded}
                  onToggle={() => setVariantsExpanded((v) => !v)}
                />
                {variantsExpanded && (
                  <div className="px-4 py-4">
                    <button
                      type="button"
                      onClick={addVariantGroup}
                      className="rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-[14px] font-semibold text-[#374151]"
                    >
                      + Add Option Group
                    </button>
                    <div className="mt-4 space-y-4">
                      {variantGroups.map((g) => (
                        <div key={g.id} className="rounded-xl border border-[#E5E7EB] p-3">
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
                            <input
                              type="text"
                              value={g.name}
                              onChange={(e) => updateVariantGroup(g.id, { name: e.target.value })}
                              placeholder="Option Group: Choose Protein"
                              className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-[14px]"
                            />
                            <button
                              type="button"
                              onClick={() => removeVariantGroup(g.id)}
                              className="rounded-lg border border-[#E5E7EB] px-3 py-2 text-[12px] text-[#6B7280]"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="mt-3 flex flex-wrap items-center gap-4 text-[14px]">
                            <label className="inline-flex items-center gap-2">
                              <input
                                type="radio"
                                name={`selection-${g.id}`}
                                checked={g.selectionType === "single"}
                                onChange={() => updateVariantGroup(g.id, { selectionType: "single" })}
                              />
                              Single
                            </label>
                            <label className="inline-flex items-center gap-2">
                              <input
                                type="radio"
                                name={`selection-${g.id}`}
                                checked={g.selectionType === "multiple"}
                                onChange={() => updateVariantGroup(g.id, { selectionType: "multiple" })}
                              />
                              Multiple
                            </label>
                            <label className="inline-flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={!!g.required}
                                onChange={(e) => updateVariantGroup(g.id, { required: e.target.checked })}
                              />
                              Required
                            </label>
                          </div>
                          <div className="mt-3 space-y-2">
                            {g.choices.map((c) => (
                              <div key={c.id} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_140px_auto]">
                                <input
                                  type="text"
                                  value={c.name}
                                  onChange={(e) => updateVariantChoice(g.id, c.id, { name: e.target.value })}
                                  placeholder="Choice"
                                  className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-[14px]"
                                />
                                <input
                                  type="number"
                                  value={c.priceDelta}
                                  onChange={(e) => updateVariantChoice(g.id, c.id, { priceDelta: e.target.value })}
                                  placeholder="+$0"
                                  className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-[14px]"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeVariantChoice(g.id, c.id)}
                                  className="rounded-lg border border-[#E5E7EB] px-3 py-2 text-[12px] text-[#6B7280]"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={() => addVariantChoice(g.id)}
                            className="mt-3 rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-[13px] font-semibold text-[#374151]"
                          >
                            + Add Choice
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedDepartment?.supportsVariants && (
              <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
                <SectionHeader
                  title="Add-ons"
                  expanded={addonsExpanded}
                  onToggle={() => setAddonsExpanded((v) => !v)}
                />
                {addonsExpanded && (
                  <div className="px-4 py-4">
                    <button
                      type="button"
                      onClick={addAddon}
                      className="rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-[14px] font-semibold text-[#374151]"
                    >
                      + Add Add-on
                    </button>
                    <div className="mt-3 space-y-2">
                      {addons.map((a) => (
                        <div key={a.id} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_120px_auto]">
                          <input
                            type="text"
                            value={a.name}
                            onChange={(e) => updateAddon(a.id, { name: e.target.value })}
                            placeholder="Extra Cheese"
                            className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-[14px]"
                          />
                          <input
                            type="number"
                            value={a.price}
                            onChange={(e) => updateAddon(a.id, { price: e.target.value })}
                            placeholder="1.50"
                            className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-[14px]"
                          />
                          <button
                            type="button"
                            onClick={() => removeAddon(a.id)}
                            className="rounded-lg border border-[#E5E7EB] px-3 py-2 text-[12px] text-[#6B7280]"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        </div>
      </div>

      {/* Floating preview as fixed layer (doesn't scroll away) */}
      {previewOpen && (
        <div
          ref={previewPanelRef}
          className="fixed z-50 w-[340px] max-w-[calc(100vw-16px)] rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_10px_30px_rgba(17,24,39,0.18)]"
          style={{ left: previewPos.x, top: previewPos.y }}
        >
          <div
            className="flex items-center justify-between gap-2 rounded-t-2xl border-b border-[#E5E7EB] bg-[#F9FAFB] px-4 py-2.5 select-none touch-none cursor-move"
            onPointerDown={handlePreviewPointerDown}
          >
            <p className="text-[14px] font-bold text-[#111827]">Preview</p>
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => setPreviewOpen(false)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#6B7280] hover:bg-white"
              aria-label="Close preview"
            >
              ✕
            </button>
          </div>

          <div className={["p-4", product.availability ? "" : "opacity-80"].join(" ")}>
            <div className="relative overflow-hidden rounded-lg border border-[#E5E7EB] bg-[#F9FAFB]">
              {imagePreviews[0] ? (
                <img
                  src={imagePreviews[0].url}
                  alt="Preview"
                  className={[
                    "h-[170px] w-full object-cover transition",
                    product.availability ? "" : "grayscale blur-[1px] brightness-90",
                  ].join(" ")}
                />
              ) : (
                <div className="flex h-[170px] items-center justify-center text-[12px] text-[#9CA3AF]">No image</div>
              )}
              {!product.availability && (
                <div className="absolute left-2 top-2 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-[12px] font-semibold text-[#6B7280] shadow-sm ring-1 ring-[#E5E7EB]">
                  <span className="h-2 w-2 rounded-full bg-[#9CA3AF]" />
                  Inactive
                </div>
              )}
            </div>

            <p
              className={[
                "mt-3 text-[18px] font-semibold text-[#111827] leading-snug",
                "[display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden",
              ].join(" ")}
              title={product.title || ""}
            >
              {product.title || "Product title"}
            </p>

            <div className="mt-1 flex items-end gap-2">
              <span className="text-[18px] font-bold text-[#283618]">
                {priceNumber ? `$${priceNumber.toFixed(2)}` : "$0.00"}
              </span>
              {showCompare && (
                <span className="text-[13px] font-semibold text-[#9CA3AF] line-through">
                  ${compareNumber.toFixed(2)}
                </span>
              )}
            </div>

            {previewTags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {previewTags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-2 rounded-full bg-[#0F5A3B] px-3 py-1.5 text-[12px] font-semibold text-white"
                  >
                    {t === "Featured" ? <span className="h-2 w-2 rounded-full bg-[#2DD4BF]" /> : null}
                    {t}
                  </span>
                ))}
              </div>
            )}

            {(variantsSummaryLine || showAddonsHint) && (
              <div className="mt-4 space-y-3 text-[13px] text-[#111827]">
                {variantsSummaryLine && <p className="border-t border-[#E5E7EB] pt-3">{variantsSummaryLine}</p>}
                {showAddonsHint && (
                  <p className={variantsSummaryLine ? "" : "border-t border-[#E5E7EB] pt-3"}>+ Add-ons available</p>
                )}
              </div>
            )}

            <div className="mt-4 border-t border-[#E5E7EB] pt-3 text-[13px] text-[#111827]">{metaLine}</div>
          </div>
        </div>
      )}

      {!previewOpen && (
        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          className="fixed z-40 inline-flex items-center gap-2 rounded-full bg-[#283618] px-4 py-2.5 text-[14px] font-semibold text-white shadow-[0_10px_25px_rgba(17,24,39,0.2)] hover:bg-[#1F2714]"
          style={
            overlayBounds
              ? {
                  left: Math.max(overlayBounds.left + 8, overlayBounds.right - 8 - 110),
                  top: Math.max(overlayBounds.top + 8, overlayBounds.bottom - 8 - 44),
                }
              : { bottom: 20, right: 20 }
          }
        >
          Preview
        </button>
      )}
    </>
  );
}
