import moment from "moment";
import { useContext, useState, useEffect, useCallback, useMemo } from "react";
import StyledDashboardButton from "../components/dashboard_components/StyledDashboardButton";
import { PageContext } from "../context/PageContext";
import Input from "../components/Input";
import TextArea from "../components/TextArea";
import ImageDropzone from "../components/ImageDropzone";
import Toast from "../components/Toast";
import Alert from "../components/Alert";
import MiniSearch from "../components/MiniSearch";
import FilterButton from "../components/FilterButton";
import CategoriesFilterDrawer from "../components/CategoriesFilterDrawer";
import { API_URL } from "../config";
import TableEmptyState from "../components/TableEmptyState";

const CATEGORIES_ITEMS_PER_PAGE_KEY = "admin:categoriesItemsPerPage";
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

function readStoredItemsPerPage(storageKey, fallback = 10) {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw == null || raw === "") return fallback;
    const n = Number(raw);
    return PAGE_SIZE_OPTIONS.includes(n) ? n : fallback;
  } catch {
    return fallback;
  }
}

function mapCategoryFromApi(c) {
  const base = c.imageUrl || c.iconUrl || "";
  const image = base.startsWith("http") ? base : base ? `${API_URL}${base}` : "";
  return {
    id: c._id,
    _id: c._id,
    name: c.name,
    description: c.description || "",
    type: c.department?.name || "Category",
    departmentId: c.department?._id || c.department,
    image,
    iconUrl: c.iconUrl,
    imageUrl: c.imageUrl,
    displayOrder: c.displayOrder,
    isActive: c.isActive,
    isFeatured: c.isFeatured,
    stock: 0,
    dateAdded: c.createdAt,
  };
}

export default function CategoriesPage() {
  const { changePage } = useContext(PageContext);
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDepartment, setFilterDepartment] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("all"); // all | active | hidden
  const [sortBy, setSortBy] = useState("newest"); // newest | oldest | name_az | name_za | display_order_asc | display_order_desc
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [modalName, setModalName] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [modalDepartmentId, setModalDepartmentId] = useState("");
  const [modalDisplayOrder, setModalDisplayOrder] = useState("0");
  const [modalIsActive, setModalIsActive] = useState(true);
  const [modalIconUrl, setModalIconUrl] = useState("");
  const [modalImageUrl, setModalImageUrl] = useState("");
  const [iconFiles, setIconFiles] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(() =>
    readStoredItemsPerPage(CATEGORIES_ITEMS_PER_PAGE_KEY)
  );
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeColumn, setActiveColumn] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  function handleRemoveIcon(file) {
    setIconFiles((prev) => prev.filter((f) => f !== file));
  }

  const fetchCategories = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterDepartment) params.set("department", filterDepartment);
      const res = await fetch(`${API_URL}/api/v1/categories?${params}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to load categories");
      setCategories((json.data?.categories || []).map(mapCategoryFromApi));
      setError(null);
    } catch (err) {
      setError(err.message);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [filterDepartment]);

  const fetchDepartments = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/departments`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to load departments");
      setDepartments(json.data?.departments || []);
    } catch (err) {
      setDepartments([]);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/products`);
      const json = await res.json();
      if (!res.ok) return setProducts([]);
      setProducts(json.data?.products || json.data?.data?.products || []);
    } catch (err) {
      setProducts([]);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterDepartment, searchQuery, visibilityFilter, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  function persistItemsPerPage(n) {
    try {
      localStorage.setItem(CATEGORIES_ITEMS_PER_PAGE_KEY, String(n));
    } catch {
      /* ignore */
    }
  }

  function formatDate(dateObject) {
    if (!dateObject) return "—";
    return moment(dateObject).format("D MMM YYYY");
  }

  const productCountByCategoryId = useMemo(() => {
    const map = {};
    (products || []).forEach((p) => {
      const catId = p.category?._id ?? p.category;
      if (catId) {
        const key = String(catId);
        map[key] = (map[key] || 0) + 1;
      }
    });
    return map;
  }, [products]);

  const filteredSortedCategories = useMemo(() => {
    let list = [...(categories || [])];
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((c) => {
        const name = (c.name || "").toLowerCase();
        const desc = (c.description || "").toLowerCase();
        const type = (c.type || "").toLowerCase();
        return name.includes(q) || desc.includes(q) || type.includes(q);
      });
    }

    if (visibilityFilter !== "all") {
      const wantsActive = visibilityFilter === "active";
      list = list.filter((c) => (wantsActive ? c.isActive !== false : c.isActive === false));
    }

    const getTime = (v) => {
      const t = new Date(v).getTime();
      return Number.isFinite(t) ? t : 0;
    };

    list.sort((a, b) => {
      if (sortBy === "oldest") return getTime(a.dateAdded) - getTime(b.dateAdded);
      if (sortBy === "name_az") return String(a.name || "").localeCompare(String(b.name || ""));
      if (sortBy === "name_za") return String(b.name || "").localeCompare(String(a.name || ""));
      if (sortBy === "display_order_asc") return (parseInt(a.displayOrder, 10) || 0) - (parseInt(b.displayOrder, 10) || 0);
      if (sortBy === "display_order_desc") return (parseInt(b.displayOrder, 10) || 0) - (parseInt(a.displayOrder, 10) || 0);
      // newest default
      return getTime(b.dateAdded) - getTime(a.dateAdded);
    });

    return list;
  }, [categories, searchQuery, visibilityFilter, sortBy]);

  const lastPage = Math.max(1, Math.ceil(filteredSortedCategories.length / itemsPerPage));
  const categoriesList = filteredSortedCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const appliedFilterCount = [visibilityFilter !== "all", sortBy !== "newest"].filter(Boolean).length;

  function handlePageClick(pageNum) {
    setCurrentPage(pageNum);
  }

  function handleAscendingSort(criteria) {
    setActiveColumn(criteria);
    setCategories((prev) => {
      const next = [...prev];
      if (criteria === "name" || criteria === "type") {
        next.sort((a, b) => (a[criteria] || "").localeCompare(b[criteria] || ""));
      } else {
        next.sort((a, b) => (a[criteria] ?? 0) - (b[criteria] ?? 0));
      }
      return next;
    });
  }

  function handleDescendingSort(criteria) {
    setActiveColumn(criteria);
    setCategories((prev) => {
      const next = [...prev];
      if (criteria === "name" || criteria === "type") {
        next.sort((a, b) => (b[criteria] || "").localeCompare(a[criteria] || ""));
      } else {
        next.sort((a, b) => (b[criteria] ?? 0) - (a[criteria] ?? 0));
      }
      return next;
    });
  }

  async function handleSaveCategory() {
    const token = localStorage.getItem("token");
    if (!token) {
      setToast({ type: "error", message: "Please sign in to save categories." });
      return;
    }
    if (!modalName.trim()) {
      setToast({ type: "error", message: "Category name is required." });
      return;
    }
    if (!modalDepartmentId) {
      setToast({ type: "error", message: "Please select a department." });
      return;
    }
    setSaveLoading(true);
    try {
      let iconUrl = modalImageUrl.trim() || modalIconUrl.trim() || "";
      let imageUrl = modalImageUrl.trim() || modalIconUrl.trim() || "";
      if (iconFiles.length > 0 && iconFiles[0] instanceof File) {
        const formData = new FormData();
        formData.append("image", iconFiles[0]);
        const uploadRes = await fetch(`${API_URL}/api/v1/upload/category-image`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const uploadJson = await uploadRes.json().catch(() => ({}));
        if (!uploadRes.ok) throw new Error(uploadJson.message || "Image upload failed");
        const uploadedUrl = uploadJson.data?.url || "";
        if (uploadedUrl) {
          iconUrl = imageUrl = uploadedUrl.startsWith("http") ? uploadedUrl : `${API_URL}${uploadedUrl}`;
        }
      }
      const body = {
        name: modalName.trim(),
        description: modalDescription.trim() || undefined,
        department: modalDepartmentId,
        displayOrder: parseInt(modalDisplayOrder, 10) || 0,
        isActive: modalIsActive,
        iconUrl: iconUrl || undefined,
        imageUrl: imageUrl || undefined,
      };
      const url = isEditing && activeCategory
        ? `${API_URL}/api/v1/categories/${activeCategory._id}`
        : `${API_URL}/api/v1/categories`;
      const method = isEditing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || "Request failed");
      setToast({ type: "success", message: isEditing ? "Category updated." : "Category created." });
      setIsAddModalOpen(false);
      resetModal();
      await fetchCategories();
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to save." });
    } finally {
      setSaveLoading(false);
    }
  }

  async function handleDeleteCategory(category) {
    const token = localStorage.getItem("token");
    if (!token) {
      setToast({ type: "error", message: "Please sign in to delete categories." });
      setDeleteConfirmTarget(null);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/v1/categories/${category._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.message || "Delete failed");
      }
      setToast({ type: "success", message: "Category deleted." });
      setDeleteConfirmTarget(null);
      await fetchCategories();
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to delete." });
      setDeleteConfirmTarget(null);
    }
  }

  function resetModal() {
    setIsEditing(false);
    setActiveCategory(null);
    setModalName("");
    setModalDescription("");
    setModalDepartmentId(departments[0]?._id || "");
    setModalDisplayOrder("0");
    setModalIsActive(true);
    setModalIconUrl("");
    setModalImageUrl("");
    setIconFiles([]);
  }

  function openEditModal(category) {
    setIsEditing(true);
    setActiveCategory(category);
    setModalName(category.name || "");
    setModalDescription(category.description || "");
    setModalDepartmentId(category.departmentId || departments[0]?._id || "");
    setModalDisplayOrder(String(category.displayOrder ?? 0));
    setModalIsActive(category.isActive !== false);
    setModalIconUrl(category.iconUrl || "");
    setModalImageUrl(category.imageUrl || "");
    setIconFiles([]);
    setIsAddModalOpen(true);
  }

  function openAddModal() {
    resetModal();
    setModalDepartmentId(departments[0]?._id || "");
    setIsAddModalOpen(true);
  }

    function handleIsSelected(row) {
        setSelectedRows((prevState) => {
            return [
                ...prevState,
                row
            ]
        })
    }

    // function handleChangePage(newPage) {
    //     setCurrentPage(newPage)
    // }

    function handleIsRemoved(row) {
        setSelectedRows((prevState) => {
            return prevState.filter((item => item !== row))
        })
    }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {changePage("categories")}
      <Toast
        open={!!toast}
        onClose={() => setToast(null)}
        message={toast?.message ?? ""}
        type={toast?.type === "error" ? "error" : toast?.type === "warning" ? "warning" : "success"}
        autoHideDuration={5000}
      />
      {deleteConfirmTarget && (
        <Alert
          variant="warning"
          title={`Delete "${deleteConfirmTarget.name}"?`}
          onDismiss={() => setDeleteConfirmTarget(null)}
        >
          <p className="mb-3">This will permanently delete this category. This action cannot be undone.</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setDeleteConfirmTarget(null)}
              className="px-3 py-1.5 rounded-lg border border-[#C2410C] text-[#C2410C] font-medium text-[14px] hover:bg-[#FFF7ED]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleDeleteCategory(deleteConfirmTarget)}
              className="px-3 py-1.5 rounded-lg bg-[#C2410C] text-white font-medium text-[14px] hover:bg-[#9A3412]"
            >
              Delete
            </button>
          </div>
        </Alert>
      )}
      <header className="flex items-center shrink-0">
        <div>
          <h1 className="text-[#333333] font-bold text-[28px] leading-[42px] tracking-[0.01em]">Categories</h1>
          <p className="mt-1 text-[15px] text-[#6B7280] font-normal">Manage food, grocery and household categories</p>
        </div>
        <div className="flex ml-auto">
          <button className="flex border border-[#283618] rounded-xl mr-2 px-[14px] py-[10px] text-[#283618] font-semibold text-[14px] leading-[20px] tracking-[0.005em]">
            <svg className="mr-2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_499_3317)">
                <path d="M6.5854 12.0813C7.36621 12.8627 8.63253 12.8631 9.41384 12.0822C9.41415 12.0819 9.41443 12.0817 9.41474 12.0813L11.5554 9.94069C11.8023 9.66759 11.7811 9.246 11.508 8.99906C11.2537 8.76916 10.8666 8.76956 10.6127 9L8.66209 10.9513L8.66674 0.666687C8.66671 0.298469 8.36824 0 8.00006 0C7.63187 0 7.3334 0.298469 7.3334 0.666656L7.3274 10.9387L5.3874 9C5.1269 8.73969 4.70471 8.73984 4.4444 9.00034C4.18409 9.26084 4.18424 9.68303 4.44474 9.94334L6.5854 12.0813Z" fill="#283618" />
                <path d="M15.3333 10.6666C14.9652 10.6666 14.6667 10.9651 14.6667 11.3333V14C14.6667 14.3682 14.3682 14.6666 14 14.6666H2C1.63181 14.6666 1.33334 14.3682 1.33334 14V11.3333C1.33334 10.9651 1.03487 10.6667 0.666687 10.6667C0.298469 10.6666 0 10.9651 0 11.3333V14C0 15.1045 0.895437 16 2 16H14C15.1046 16 16 15.1045 16 14V11.3333C16 10.9651 15.7015 10.6666 15.3333 10.6666Z" fill="#283618" />
              </g>
              <defs>
                <clipPath id="clip0_499_3317">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
            Export
          </button>
          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center rounded-xl px-[14px] py-[10px] bg-[#283618] text-white font-semibold text-[14px] leading-[20px] tracking-[0.005em]"
          >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_499_3320)">
                                <path d="M17.3333 9.33333H10.6667V2.66667C10.6667 2.48986 10.5964 2.32029 10.4714 2.19526C10.3464 2.07024 10.1768 2 10 2V2C9.82319 2 9.65362 2.07024 9.5286 2.19526C9.40357 2.32029 9.33333 2.48986 9.33333 2.66667V9.33333H2.66667C2.48986 9.33333 2.32029 9.40357 2.19526 9.5286C2.07024 9.65362 2 9.82319 2 10V10C2 10.1768 2.07024 10.3464 2.19526 10.4714C2.32029 10.5964 2.48986 10.6667 2.66667 10.6667H9.33333V17.3333C9.33333 17.5101 9.40357 17.6797 9.5286 17.8047C9.65362 17.9298 9.82319 18 10 18C10.1768 18 10.3464 17.9298 10.4714 17.8047C10.5964 17.6797 10.6667 17.5101 10.6667 17.3333V10.6667H17.3333C17.5101 10.6667 17.6797 10.5964 17.8047 10.4714C17.9298 10.3464 18 10.1768 18 10C18 9.82319 17.9298 9.65362 17.8047 9.5286C17.6797 9.40357 17.5101 9.33333 17.3333 9.33333Z" fill="white" />
                            </g>
                            <defs>
                                <clipPath id="clip0_499_3320">
                                    <rect width="16" height="16" fill="white" transform="translate(2 2)" />
                                </clipPath>
                            </defs>
                        </svg>
                        <p className='ml-2'>Add Category</p>
                    </button>
                </div>
      </header>

      {/* Tab control — fixed like page title */}
      <div className="shrink-0 mt-2 mb-4 flex items-center">
        <div className="inline-flex items-stretch rounded-xl border border-[#E5E7EB] bg-white p-0.5 text-sm font-medium">
          <button
            type="button"
            onClick={() => setFilterDepartment(null)}
            className={`rounded-lg px-4 py-2 transition-colors ${
              filterDepartment == null
                ? "bg-[#283618] text-white"
                : "text-[#6B7280] hover:text-[#4B5563] hover:bg-[#F9FAFB]"
            }`}
          >
            All
          </button>
          {departments.map((d) => (
            <span key={d._id} className="flex items-stretch">
              <span className="w-px self-stretch bg-[#E5E7EB]" aria-hidden />
              <button
                type="button"
                onClick={() => setFilterDepartment(d._id)}
                className={`rounded-lg px-4 py-2 transition-colors ${
                  filterDepartment === d._id
                    ? "bg-[#283618] text-white"
                    : "text-[#6B7280] hover:text-[#4B5563] hover:bg-[#F9FAFB]"
                }`}
              >
                {d.name}
              </button>
            </span>
          ))}
        </div>

        <div className="flex items-center mb-2 space-x-3 ml-auto">
          <MiniSearch searchItem="categories" value={searchQuery} onChange={setSearchQuery} />
          <FilterButton
            onClick={() => setFilterDrawerOpen(true)}
            active={appliedFilterCount > 0}
            appliedCount={appliedFilterCount}
          />
        </div>
      </div>

      <CategoriesFilterDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        visibilityFilter={visibilityFilter}
        setVisibilityFilter={setVisibilityFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onReset={() => {
          setVisibilityFilter("all");
          setSortBy("newest");
        }}
      />

      {/* Scrollable: only category items (cards) */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {loading && (
          <p className="text-[#6B7280] font-medium">Loading categories…</p>
        )}
        {error && (
          <p className="text-red-600 font-medium">{error}</p>
        )}
        {!loading && !error && (
          <>
            {categoriesList.length === 0 ? (
              <TableEmptyState
                title="No categories found"
                description="Try adjusting filters or create a new category."
              />
            ) : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {categoriesList.map((category) => (
                <div
                  key={category.id}
                  className={[
                    "flex flex-col bg-white rounded-2xl shadow-sm border border-[#F0F1F3] overflow-hidden",
                    category.isActive === false ? "opacity-80" : "",
                  ].join(" ")}
                >
                  <div className="relative h-32 bg-[#F9F9FC] flex items-center justify-center">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className={[
                          "h-20 w-20 object-contain transition",
                          category.isActive === false ? "grayscale blur-[1px] brightness-90" : "",
                        ].join(" ")}
                      />
                    ) : (
                      <span
                        className={[
                          "text-[#A3A9B6] text-sm transition",
                          category.isActive === false ? "grayscale blur-[1px] brightness-90" : "",
                        ].join(" ")}
                      >
                        No image
                      </span>
                    )}
                    {category.isActive === false && (
                      <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-[#FEF3C7] px-2.5 py-1 text-[11px] font-semibold text-[#B45309] shadow-sm ring-1 ring-[#FCD34D]/40">
                        Hidden
                      </span>
                    )}
                  </div>
                  <div className="flex-1 px-4 pt-4 pb-3">
                    <p className="font-bold text-[16px] leading-[24px] text-[#333333]">
                      {category.name}
                    </p>
                    <p className="mt-1 text-[13px] font-semibold text-[#777980]">
                      {category.type || "Category"}
                    </p>
                    <p className="mt-1 text-[13px] text-[#A3A9B6]">
                      {(productCountByCategoryId[category.id] ?? 0)} products
                    </p>
                    <p className="mt-1 text-[11px] text-[#A3A9B6]">
                      Added {formatDate(category.dateAdded)}
                    </p>
                  </div>
                  <div className="mt-auto flex w-full border-t border-[#F0F1F3]">
                    <button
                      type="button"
                      className="w-1/2 py-3 text-center text-[13px] font-semibold text-[#283618] bg-[#F4F9EE] hover:bg-[#EAF4DE] transition-colors"
                      onClick={() => openEditModal(category)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="w-1/2 py-3 text-center text-[13px] font-semibold text-[#B91C1C] bg-[#FFF2F2] hover:bg-[#FFE6E6] transition-colors border-l border-[#F0F1F3]"
                      onClick={() => setDeleteConfirmTarget(category)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Pagination / control bar — fixed near bottom */}
      <div className="shrink-0 rounded-xl bg-white w-full p-4  flex items-center border-t border-[#F0F1F3] bg-panel-bg">
        <p className="font-semibold text-[14px] text-customGrey leading-[20px] tracking-[0.005em]">
          Showing {(currentPage - 1) * itemsPerPage + 1}–
          {Math.min(currentPage * itemsPerPage, filteredSortedCategories.length)} of {filteredSortedCategories.length}
        </p>
        <div className="ml-4 flex items-center gap-2">
          <label htmlFor="categories-items-per-page" className="text-[13px] text-[#6B7280] font-medium">
            Items per page
          </label>
          <select
            id="categories-items-per-page"
            value={itemsPerPage}
            onChange={(e) => {
              const n = Number(e.target.value);
              setItemsPerPage(n);
              persistItemsPerPage(n);
            }}
            className="h-9 rounded-lg border border-[#D1D5DB] bg-white px-2.5 text-[13px] text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#283618]/20 focus:border-[#283618]"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <div className="ml-auto flex space-x-2">
          <StyledDashboardButton handleClick={() => handlePageClick(Math.max(1, currentPage - 1))} isDisabled={currentPage === 1}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.86 14.3933L7.14003 10.6667C7.01586 10.5418 6.94617 10.3728 6.94617 10.1967C6.94617 10.0205 7.01586 9.85158 7.14003 9.72667L10.86 6.00001C10.9533 5.90599 11.0724 5.84187 11.2022 5.81582C11.3321 5.78977 11.4667 5.80298 11.589 5.85376C11.7113 5.90454 11.8157 5.99058 11.8889 6.10093C11.9621 6.21128 12.0008 6.34092 12 6.47334V13.92C12.0008 14.0524 11.9621 14.1821 11.8889 14.2924C11.8157 14.4028 11.7113 14.4888 11.589 14.5396C11.4667 14.5904 11.3321 14.6036 11.2022 14.5775C11.0724 14.5515 10.9533 14.4874 10.86 14.3933Z" fill="currentColor" />
            </svg>
          </StyledDashboardButton>
          {Array.from({ length: lastPage }, (_, i) => i + 1).map((pageNum) => (
            <StyledDashboardButton key={pageNum} handleClick={() => handlePageClick(pageNum)} isActive={currentPage === pageNum}>
              {pageNum}
            </StyledDashboardButton>
          ))}
          <StyledDashboardButton handleClick={() => handlePageClick(Math.min(lastPage, currentPage + 1))} isDisabled={currentPage === lastPage}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 11.9193V4.47133C6.00003 4.3395 6.03914 4.21064 6.1124 4.10103C6.18565 3.99142 6.28976 3.906 6.41156 3.85555C6.53336 3.8051 6.66738 3.7919 6.79669 3.81761C6.92599 3.84332 7.04476 3.90679 7.138 4L10.862 7.724C10.987 7.84902 11.0572 8.01856 11.0572 8.19533C11.0572 8.37211 10.987 8.54165 10.862 8.66667L7.138 12.3907C7.04476 12.4839 6.92599 12.5473 6.79669 12.5731C6.66738 12.5988 6.53336 12.5856 6.41156 12.5351C6.28976 12.4847 6.18565 12.3992 6.1124 12.2896C6.03914 12.18 6.00003 12.0512 6 11.9193Z" fill="currentColor" />
            </svg>
          </StyledDashboardButton>
        </div>
      </div>

            {/* Add Category modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl">
                        <div className="flex items-start justify-between px-6 pt-3 pb-3 bg-[#283618] rounded-t-2xl border-b border-[#F0F1F3]">
                            <div>
                                <p className="text-[20px] font-bold text-white">
                                    {isEditing ? "Edit Category" : "Add Category"}
                                </p>
                                <p className="text-[13px] text-white mt-1">
                                    {isEditing
                                        ? "Update this category’s details."
                                        : "Create a new category to organize your products."}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => { setIsAddModalOpen(false); resetModal(); }}
                                className="text-white hover:text-[#4B5563]"
                            >
                                <svg width="20" height="20" className="mr-2" color="white" viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.94252 7.99999L15.8045 1.13799C15.926 1.01225 15.9932 0.84385 15.9916 0.669052C15.9901 0.494255 15.92 0.327046 15.7964 0.203441C15.6728 0.0798355 15.5056 0.00972286 15.3308 0.00820391C15.156 0.00668497 14.9876 0.0738812 14.8619 0.19532L7.99986 7.05732L1.13786 0.19532C1.01212 0.0738812 0.843721 0.00668497 0.668923 0.00820391C0.494126 0.00972286 0.326917 0.0798355 0.203312 0.203441C0.0797065 0.327046 0.00959389 0.494255 0.00807494 0.669052C0.00655599 0.84385 0.0737523 1.01225 0.195191 1.13799L7.05719 7.99999L0.195191 14.862C0.0702103 14.987 0 15.1565 0 15.3333C0 15.5101 0.0702103 15.6796 0.195191 15.8047C0.320209 15.9296 0.489748 15.9998 0.666524 15.9998C0.8433 15.9998 1.01284 15.9296 1.13786 15.8047L7.99986 8.94265L14.8619 15.8047C14.9869 15.9296 15.1564 15.9998 15.3332 15.9998C15.51 15.9998 15.6795 15.9296 15.8045 15.8047C15.9295 15.6796 15.9997 15.5101 15.9997 15.3333C15.9997 15.1565 15.9295 14.987 15.8045 14.862L8.94252 7.99999Z" fill="white" />
                                </svg>
                            </button>
                        </div>
                        <div className="px-6 py-3">
                            <div className="space-y-5">
                                <Input
                                    label="Category Name"
                                    placeholder="Type category name here"
                                    text={modalName}
                                    onInputChange={(e) => setModalName(e.target.value)}
                                />

                                <div>
                                    <label className="block text-[14px] font-semibold text-[#374151] tracking-[0.005em] mb-1.5">Category Type (Department)</label>
                                    <div className="inline-flex flex-wrap gap-1.5 rounded-xl border border-[#E5E7EB] bg-[#F9F9FC] p-1.5">
                                        {departments.map((d) => (
                                            <button
                                                key={d._id}
                                                type="button"
                                                onClick={() => setModalDepartmentId(d._id)}
                                                className={`px-4 py-2 rounded-lg text-[14px] font-medium transition-colors ${modalDepartmentId === d._id ? "bg-white shadow-sm text-[#283618] border border-[#E5E7EB]" : "text-[#6B7280] hover:text-[#374151]"}`}
                                            >
                                                {d.name}
                                            </button>
                                        ))}
                                        {departments.length === 0 && <span className="px-4 py-2 text-[14px] text-[#6B7280]">No departments loaded</span>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[14px] font-semibold text-[#374151] tracking-[0.005em] mb-1.5">Icon / Image</label>
                                    <ImageDropzone
                                        description="Upload an image or drag and drop"
                                        files={iconFiles}
                                        onFilesChange={setIconFiles}
                                        onRemoveFile={handleRemoveIcon}
                                    />
                                    <p className="mt-2 text-[13px] text-[#6B7280]">Or use an HTTPS URL</p>
                                    <input
                                        type="url"
                                        placeholder="https://..."
                                        value={modalImageUrl}
                                        onChange={(e) => setModalImageUrl(e.target.value)}
                                        className="w-full mt-1 px-3 py-2.5 bg-[#F9F9FC] rounded-lg border border-[#E5E7EB] text-[14px] text-[#374151] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#283618]/20 focus:border-[#283618]"
                                    />
                                </div>

                                <TextArea
                                    label="Description (optional)"
                                    placeholder="Type category description here"
                                    text={modalDescription}
                                    onInputChange={(e) => setModalDescription(e.target.value)}
                                />

                                <div className="grid grid-cols-2 gap-5">
                                    <Input
                                        label="Display Order"
                                        placeholder="0"
                                        text={modalDisplayOrder}
                                        onInputChange={(e) => setModalDisplayOrder(e.target.value)}
                                    />
                                    <div>
                                        <label className="block text-[14px] font-semibold text-[#374151] tracking-[0.005em] mb-1.5">Visibility</label>
                                        <div className="inline-flex rounded-xl border border-[#E5E7EB] bg-[#F9F9FC] p-1.5 gap-0">
                                            <button
                                                type="button"
                                                onClick={() => setModalIsActive(true)}
                                                className={`px-4 py-2 rounded-lg text-[14px] font-medium transition-colors ${modalIsActive ? "bg-[#ECFDF3] text-[#15803D] border border-[#E5E7EB]" : "text-[#6B7280] hover:text-[#374151]"}`}
                                            >
                                                Active
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setModalIsActive(false)}
                                                className={`px-4 py-2 rounded-lg text-[14px] font-medium transition-colors ${!modalIsActive ? "bg-[#FEE2E2] text-[#B91C1C] border border-[#E5E7EB]" : "text-[#6B7280] hover:text-[#374151]"}`}
                                            >
                                                Hidden
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#E5E7EB] bg-[#F9FAFB] rounded-b-2xl">
                            <button
                                type="button"
                                onClick={() => { setIsAddModalOpen(false); resetModal(); }}
                                className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-[14px] font-semibold text-[#6B7280]"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveCategory}
                                disabled={saveLoading}
                                className="px-5 py-2 rounded-xl bg-[#283618] text-white text-[14px] font-semibold disabled:opacity-50"
                            >
                                {saveLoading ? "Saving…" : isEditing ? "Save Changes" : "Save Category"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    )
}