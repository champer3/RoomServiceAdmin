import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheck,
  faImage,
  faPercent,
  faTicket,
  faTags,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { PageContext } from "../context/PageContext";
import Path from "../components/Path";
import Toast from "../components/Toast";
import PromotionPreviewPanel from "../components/promotions/PromotionPreviewPanel";
import { API_URL } from "../config";
import { createPromotion, getPromotion, updatePromotion } from "../api/promotions";
import {
  AUDIENCE_TYPES,
  CONDITION_TYPES,
  COUPON_DISCOUNT_TYPES,
  CTA_TYPES,
  DEAL_TYPES,
  DISCOUNT_TYPES,
  PLACEMENT_CONTEXT_TYPES,
  PLACEMENT_SLOTS,
  PLACEMENT_SURFACES,
  REWARD_TYPES,
  TARGET_TYPES,
  buildNameMaps,
} from "../utils/promotionDisplay";

function productOptionLabel(p) {
  if (!p) return "—";
  return p.title || p.name || "—";
}

const STEPS = [
  { id: 1, title: "Type" },
  { id: 2, title: "Basic info" },
  { id: 3, title: "Targets" },
  { id: 4, title: "Placement" },
  { id: 5, title: "Audience" },
  { id: 6, title: "Behavior" },
];

function emptyForm(type) {
  const base = {
    type,
    title: "",
    subtitle: "",
    description: "",
    status: "draft",
    imageUrl: "",
    mobileImageUrl: "",
    startAt: "",
    endAt: "",
    displayOrder: 0,
    isStackable: false,
    targets: [{ targetType: "all", targetId: "" }],
    placements: [
      { surface: "home", slot: "hero", contextType: "none", contextId: "", displayOrder: 0 },
    ],
    audiences: [{ audienceType: "all_users", audienceRule: {} }],
    specialConfig: {
      badgeLabel: "",
      ctaLabel: "",
      ctaType: "none",
      ctaTarget: "",
      highlightStyle: "standard",
    },
    saleConfig: {
      discountType: "percentage",
      discountValue: 10,
      showSaleBadge: true,
      badgeLabel: "Sale",
    },
    bannerConfig: {
      headline: "",
      subheadline: "",
      buttonLabel: "",
      buttonType: "none",
      buttonTarget: "",
      theme: "default",
      textAlignment: "left",
    },
    couponConfig: {
      code: "",
      discountType: "percentage",
      discountValue: 0,
      minimumOrderAmount: 0,
      usageLimit: "",
      perCustomerLimit: "",
      firstOrderOnly: false,
    },
    dealConfig: {
      dealType: "bundle_price",
      promoLabel: "",
      minimumOrderAmount: 0,
      usageLimit: "",
      perCustomerLimit: "",
    },
    dealConditions: [],
    dealRewards: [],
  };
  return base;
}

function normalizeLoaded(p) {
  if (!p) return null;
  const f = emptyForm(p.type || "special");
  f.type = p.type;
  f.title = p.title || "";
  f.subtitle = p.subtitle || "";
  f.description = p.description || "";
  f.status = p.status || "draft";
  f.imageUrl = p.imageUrl || "";
  f.mobileImageUrl = p.mobileImageUrl || "";
  f.startAt = p.startAt
    ? (typeof p.startAt === "string" ? p.startAt.slice(0, 10) : new Date(p.startAt).toISOString().slice(0, 10))
    : "";
  f.endAt = p.endAt
    ? (typeof p.endAt === "string" ? p.endAt.slice(0, 10) : new Date(p.endAt).toISOString().slice(0, 10))
    : "";
  f.displayOrder = p.displayOrder ?? 0;
  f.isStackable = !!p.isStackable;
  const t0 = p.targets?.[0];
  f.targets = [
    {
      targetType: t0?.targetType || "all",
      targetId: t0?.targetId ? String(t0.targetId) : "",
    },
  ];
  const pl0 = p.placements?.[0];
  f.placements = [
    {
      surface: pl0?.surface || "home",
      slot: pl0?.slot || "hero",
      contextType: pl0?.contextType || "none",
      contextId: pl0?.contextId ? String(pl0.contextId) : "",
      displayOrder: pl0?.displayOrder ?? 0,
    },
  ];
  const a0 = p.audiences?.[0];
  f.audiences = [
    {
      audienceType: a0?.audienceType || "all_users",
      audienceRule:
        a0?.audienceRule && typeof a0.audienceRule === "object"
          ? { ...a0.audienceRule }
          : {},
    },
  ];
  if (p.specialConfig) f.specialConfig = { ...f.specialConfig, ...p.specialConfig };
  if (p.saleConfig) f.saleConfig = { ...f.saleConfig, ...p.saleConfig };
  if (p.bannerConfig) f.bannerConfig = { ...f.bannerConfig, ...p.bannerConfig };
  if (p.couponConfig) f.couponConfig = { ...f.couponConfig, ...p.couponConfig };
  if (p.dealConfig) f.dealConfig = { ...f.dealConfig, ...p.dealConfig };
  f.dealConditions = (p.dealConditions || []).map((c) => ({
    conditionType: c.conditionType,
    conditionValue: c.conditionValue,
  }));
  f.dealRewards = (p.dealRewards || []).map((r) => ({
    rewardType: r.rewardType,
    rewardValue: r.rewardValue,
  }));
  if (f.couponConfig.usageLimit == null) f.couponConfig.usageLimit = "";
  if (f.couponConfig.perCustomerLimit == null) f.couponConfig.perCustomerLimit = "";
  if (f.dealConfig.usageLimit == null) f.dealConfig.usageLimit = "";
  if (f.dealConfig.perCustomerLimit == null) f.dealConfig.perCustomerLimit = "";
  return f;
}

function buildPayload(form, { omitType } = {}) {
  const targets =
    form.targets[0].targetType === "all"
      ? [{ targetType: "all", targetId: null }]
      : [{ targetType: form.targets[0].targetType, targetId: form.targets[0].targetId || null }];

  const pl = form.placements[0];
  const placements = [
    {
      surface: pl.surface,
      slot: pl.slot,
      contextType: pl.contextType,
      contextId:
        pl.contextType !== "none" && pl.contextId
          ? pl.contextId
          : null,
      displayOrder: Number(pl.displayOrder) || 0,
    },
  ];

  const aud = form.audiences[0];
  const audiences =
    aud.audienceType === "all_users"
      ? []
      : [{ audienceType: aud.audienceType, audienceRule: aud.audienceRule || {} }];

  const body = {
    title: form.title.trim(),
    subtitle: form.subtitle.trim() || undefined,
    description: form.description.trim() || undefined,
    status: form.status,
    imageUrl: form.imageUrl.trim() || undefined,
    mobileImageUrl: form.mobileImageUrl.trim() || undefined,
    startAt: form.startAt ? new Date(form.startAt).toISOString() : null,
    endAt: form.endAt ? new Date(form.endAt).toISOString() : null,
    displayOrder: Number(form.displayOrder) || 0,
    isStackable: !!form.isStackable,
    targets,
    placements,
    audiences,
  };

  if (!omitType) {
    body.type = form.type;
  }

  if (form.type === "special") {
    body.specialConfig = { ...form.specialConfig };
  } else if (form.type === "sale") {
    body.saleConfig = {
      discountType: form.saleConfig.discountType,
      discountValue: Number(form.saleConfig.discountValue),
      showSaleBadge: !!form.saleConfig.showSaleBadge,
      badgeLabel: form.saleConfig.badgeLabel || "Sale",
    };
  } else if (form.type === "banner") {
    body.bannerConfig = { ...form.bannerConfig };
  } else if (form.type === "coupon") {
    body.couponConfig = {
      code: String(form.couponConfig.code || "").trim().toUpperCase(),
      discountType: form.couponConfig.discountType,
      discountValue: Number(form.couponConfig.discountValue) || 0,
      minimumOrderAmount: Number(form.couponConfig.minimumOrderAmount) || 0,
      usageLimit: form.couponConfig.usageLimit === "" ? null : Number(form.couponConfig.usageLimit),
      perCustomerLimit:
        form.couponConfig.perCustomerLimit === "" ? null : Number(form.couponConfig.perCustomerLimit),
      firstOrderOnly: !!form.couponConfig.firstOrderOnly,
    };
  } else if (form.type === "deal") {
    body.dealConfig = {
      dealType: form.dealConfig.dealType,
      promoLabel: form.dealConfig.promoLabel || undefined,
      minimumOrderAmount: Number(form.dealConfig.minimumOrderAmount) || 0,
      usageLimit: form.dealConfig.usageLimit === "" ? null : Number(form.dealConfig.usageLimit),
      perCustomerLimit:
        form.dealConfig.perCustomerLimit === "" ? null : Number(form.dealConfig.perCustomerLimit),
    };
    body.dealConditions = form.dealConditions;
    body.dealRewards = form.dealRewards;
  }

  return body;
}

function draftToPreview(form) {
  const targets =
    form.targets[0].targetType === "all"
      ? [{ targetType: "all", targetId: null }]
      : [{ targetType: form.targets[0].targetType, targetId: form.targets[0].targetId || null }];
  const pl = form.placements[0];
  return {
    _id: "preview",
    type: form.type,
    title: form.title || "Untitled",
    subtitle: form.subtitle,
    description: form.description,
    status: form.status,
    imageUrl: form.imageUrl,
    startAt: form.startAt,
    endAt: form.endAt,
    targets,
    placements: [
      {
        surface: pl.surface,
        slot: pl.slot,
        contextType: pl.contextType,
        contextId: pl.contextId || null,
      },
    ],
    audiences: form.audiences,
    specialConfig: form.specialConfig,
    saleConfig: form.saleConfig,
    bannerConfig: form.bannerConfig,
    couponConfig: form.couponConfig,
    dealConfig: form.dealConfig,
    dealConditions: form.dealConditions,
    dealRewards: form.dealRewards,
  };
}

function AudienceRuleFields({ form, setForm }) {
  const aud = form.audiences[0];
  const type = aud.audienceType;
  const rule = aud.audienceRule || {};

  const setRule = (patch) => {
    setForm((f) => ({
      ...f,
      audiences: [{ ...f.audiences[0], audienceRule: { ...f.audiences[0].audienceRule, ...patch } }],
    }));
  };

  if (type === "high_spend") {
    return (
      <div className="mt-2">
        <label className="text-sm text-[#6B7280]">Lifetime spend ≥</label>
        <input
          type="number"
          className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
          value={rule.minLifetimeSpend ?? ""}
          onChange={(e) => setRule({ minLifetimeSpend: Number(e.target.value) || 0 })}
        />
      </div>
    );
  }
  if (type === "high_order_count") {
    return (
      <div className="mt-2">
        <label className="text-sm text-[#6B7280]">Order count ≥</label>
        <input
          type="number"
          className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
          value={rule.minOrders ?? ""}
          onChange={(e) => setRule({ minOrders: Number(e.target.value) || 0 })}
        />
      </div>
    );
  }
  if (type === "compensated_users") {
    return (
      <div className="mt-2">
        <label className="text-sm text-[#6B7280]">Has received compensation</label>
        <select
          className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
          value={rule.hasCompensation === true ? "yes" : "no"}
          onChange={(e) => setRule({ hasCompensation: e.target.value === "yes" })}
        >
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>
    );
  }
  return null;
}

export default function PromotionEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { changePage } = useContext(PageContext);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(() => emptyForm("special"));
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", type: "success" });

  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const maps = useMemo(() => buildNameMaps(departments, categories, products), [departments, categories, products]);

  useEffect(() => {
    let cancelled = false;
    if (!isEdit) return;
    setLoading(true);
    getPromotion(id)
      .then((res) => {
        const p = res?.data?.data?.promotion;
        if (!cancelled && p) {
          setForm(normalizeLoaded(p));
          setStep(2);
        }
      })
      .catch((e) => {
        setToast({
          open: true,
          message: e?.response?.data?.message || e.message || "Load failed",
          type: "error",
        });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, isEdit]);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/departments`)
      .then((r) => r.json())
      .then((j) => setDepartments(j.data?.departments || []));
    fetch(`${API_URL}/api/v1/categories`)
      .then((r) => r.json())
      .then((j) => setCategories(j.data?.categories || []));
    fetch(`${API_URL}/api/v1/products`)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((j) => {
        const list = j?.data?.products;
        setProducts(Array.isArray(list) ? list : []);
      })
      .catch(() => setProducts([]));
  }, []);

  const previewDoc = useMemo(() => draftToPreview(form), [form]);

  const submit = useCallback(
    async (publish) => {
      try {
        const payload = buildPayload(
          { ...form, status: publish ? "active" : form.status },
          { omitType: isEdit }
        );
        setSaving(true);
        if (isEdit) {
          await updatePromotion(id, payload);
        } else {
          await createPromotion(payload);
        }
        setToast({ open: true, message: isEdit ? "Saved" : "Created", type: "success" });
        setTimeout(() => navigate("/promotions"), 600);
      } catch (e) {
        setToast({
          open: true,
          message: e?.response?.data?.message || e.message || "Save failed",
          type: "error",
        });
      } finally {
        setSaving(false);
      }
    },
    [form, id, isEdit, navigate]
  );

  const targetSelect = () => {
    const t = form.targets[0];
    if (t.targetType === "department") {
      return (
        <select
          className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
          value={t.targetId}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              targets: [{ ...f.targets[0], targetId: e.target.value }],
            }))
          }
        >
          <option value="">Select department</option>
          {departments.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name}
            </option>
          ))}
        </select>
      );
    }
    if (t.targetType === "category") {
      return (
        <select
          className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
          value={t.targetId}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              targets: [{ ...f.targets[0], targetId: e.target.value }],
            }))
          }
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      );
    }
    if (t.targetType === "product") {
      return (
        <select
          className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
          value={t.targetId}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              targets: [{ ...f.targets[0], targetId: e.target.value }],
            }))
          }
        >
          <option value="">Select product</option>
          {products.map((p) => (
            <option key={p._id} value={p._id}>
              {productOptionLabel(p)}
            </option>
          ))}
        </select>
      );
    }
    return null;
  };

  if (loading) {
    return <p className="p-8 text-[#6B7280]">Loading…</p>;
  }

  return (
    <>
      {changePage("promotions")}
      <Toast
        open={toast.open}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        message={toast.message}
        type={toast.type}
        title={toast.type === "error" ? "Error" : "Done"}
      />

      <div className="flex flex-col lg:flex-row gap-6 min-h-0">
        <div className="flex-1 min-w-0 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[#333333] font-bold text-[28px] leading-[42px]">
                {isEdit ? "Edit promotion" : "Create promotion"}
              </p>
              <Path
                pages={[
                  { name: "Dashboard", link: "dashboard" },
                  { name: "Promotions", link: "promotions" },
                  { name: isEdit ? "Edit" : "New", link: isEdit ? `promotions/${id}/edit` : "promotions/new" },
                ]}
              />
            </div>
            <Link
              to="/promotions"
              className="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm font-medium text-[#4B5563] hover:bg-[#F9FAFB]"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Back
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            {STEPS.map((s) => (
              <button
                key={s.id}
                type="button"
                disabled={!isEdit && s.id === 1 && step > 1}
                onClick={() => {
                  if (isEdit && s.id === 1) return;
                  setStep(s.id);
                }}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  step === s.id ? "bg-[#283618] text-white" : "bg-white border border-[#E5E7EB] text-[#6B7280]"
                }`}
              >
                {s.id}. {s.title}
              </button>
            ))}
          </div>

          {step === 1 && !isEdit && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { type: "special", label: "Special", icon: faWandMagicSparkles },
                { type: "sale", label: "Sale", icon: faPercent },
                { type: "deal", label: "Deal", icon: faTags },
                { type: "banner", label: "Banner", icon: faImage },
                { type: "coupon", label: "Coupon", icon: faTicket },
              ].map((card) => (
                <button
                  key={card.type}
                  type="button"
                  onClick={() => {
                    setForm(emptyForm(card.type));
                    setStep(2);
                  }}
                  className="rounded-2xl border border-[#E5E7EB] bg-white p-6 text-left shadow-sm hover:border-[#283618] hover:shadow-md transition-all"
                >
                  <FontAwesomeIcon icon={card.icon} className="h-8 w-8 text-[#283618] mb-3" />
                  <p className="font-bold text-lg text-[#111827]">{card.label}</p>
                  <p className="text-sm text-[#6B7280] mt-1">Configure {card.label.toLowerCase()} rules</p>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 space-y-4">
              <p className="font-bold text-[18px] text-[#333333]">Basic information</p>
              {isEdit && (
                <p className="text-sm text-[#6B7280]">
                  Type: <span className="font-semibold text-[#111827]">{form.type}</span> (cannot change)
                </p>
              )}
              <div>
                <label className="text-sm font-medium text-[#374151]">Title *</label>
                <input
                  className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#374151]">Subtitle</label>
                <input
                  className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                  value={form.subtitle}
                  onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#374151]">Description</label>
                <textarea
                  className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm min-h-[80px]"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[#374151]">Status</label>
                  <select
                    className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  >
                    {["draft", "active", "inactive", "scheduled", "expired"].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#374151]">Display order</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                    value={form.displayOrder}
                    onChange={(e) => setForm((f) => ({ ...f, displayOrder: Number(e.target.value) }))}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[#374151]">Image URL</label>
                <input
                  className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                  value={form.imageUrl}
                  onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                  placeholder="/uploads/..."
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#374151]">Mobile image URL</label>
                <input
                  className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                  value={form.mobileImageUrl}
                  onChange={(e) => setForm((f) => ({ ...f, mobileImageUrl: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[#374151]">Start date</label>
                  <input
                    type="date"
                    className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                    value={form.startAt}
                    onChange={(e) => setForm((f) => ({ ...f, startAt: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#374151]">End date</label>
                  <input
                    type="date"
                    className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                    value={form.endAt}
                    onChange={(e) => setForm((f) => ({ ...f, endAt: e.target.value }))}
                  />
                </div>
              </div>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isStackable}
                  onChange={(e) => setForm((f) => ({ ...f, isStackable: e.target.checked }))}
                />
                Stackable with other promotions
              </label>
            </div>
          )}

          {step === 3 && (
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 space-y-4">
              <p className="font-bold text-[18px] text-[#333333]">Targets</p>
              <div>
                <label className="text-sm font-medium text-[#374151]">Target type</label>
                <select
                  className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                  value={form.targets[0].targetType}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      targets: [{ targetType: e.target.value, targetId: "" }],
                    }))
                  }
                >
                  {TARGET_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              {targetSelect()}
            </div>
          )}

          {step === 4 && (
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 space-y-4">
              <p className="font-bold text-[18px] text-[#333333]">Placement</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[#374151]">Surface</label>
                  <select
                    className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                    value={form.placements[0].surface}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        placements: [{ ...f.placements[0], surface: e.target.value }],
                      }))
                    }
                  >
                    {PLACEMENT_SURFACES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#374151]">Slot</label>
                  <select
                    className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                    value={form.placements[0].slot}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        placements: [{ ...f.placements[0], slot: e.target.value }],
                      }))
                    }
                  >
                    {PLACEMENT_SLOTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[#374151]">Context type</label>
                <select
                  className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                  value={form.placements[0].contextType}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      placements: [{ ...f.placements[0], contextType: e.target.value, contextId: "" }],
                    }))
                  }
                >
                  {PLACEMENT_CONTEXT_TYPES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              {form.placements[0].contextType === "department" && (
                <select
                  className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                  value={form.placements[0].contextId}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      placements: [{ ...f.placements[0], contextId: e.target.value }],
                    }))
                  }
                >
                  <option value="">Context department</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              )}
              {form.placements[0].contextType === "category" && (
                <select
                  className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                  value={form.placements[0].contextId}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      placements: [{ ...f.placements[0], contextId: e.target.value }],
                    }))
                  }
                >
                  <option value="">Context category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
              {form.placements[0].contextType === "product" && (
                <select
                  className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                  value={form.placements[0].contextId}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      placements: [{ ...f.placements[0], contextId: e.target.value }],
                    }))
                  }
                >
                  <option value="">Context product</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {productOptionLabel(p)}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 space-y-4">
              <p className="font-bold text-[18px] text-[#333333]">Audience</p>
              <div>
                <label className="text-sm font-medium text-[#374151]">Audience type</label>
                <select
                  className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                  value={form.audiences[0].audienceType}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      audiences: [{ audienceType: e.target.value, audienceRule: {} }],
                    }))
                  }
                >
                  {AUDIENCE_TYPES.map((a) => (
                    <option key={a.value} value={a.value}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>
              <AudienceRuleFields form={form} setForm={setForm} />
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              {form.type === "special" && (
                <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 space-y-3">
                  <p className="font-bold text-[18px] text-[#333333]">Special</p>
                  <input
                    placeholder="Badge label"
                    className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                    value={form.specialConfig.badgeLabel}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        specialConfig: { ...f.specialConfig, badgeLabel: e.target.value },
                      }))
                    }
                  />
                  <input
                    placeholder="CTA label"
                    className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                    value={form.specialConfig.ctaLabel}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        specialConfig: { ...f.specialConfig, ctaLabel: e.target.value },
                      }))
                    }
                  />
                  <select
                    className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                    value={form.specialConfig.ctaType}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        specialConfig: { ...f.specialConfig, ctaType: e.target.value },
                      }))
                    }
                  >
                    {CTA_TYPES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <input
                    placeholder="CTA target"
                    className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                    value={form.specialConfig.ctaTarget}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        specialConfig: { ...f.specialConfig, ctaTarget: e.target.value },
                      }))
                    }
                  />
                  <select
                    className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                    value={form.specialConfig.highlightStyle}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        specialConfig: { ...f.specialConfig, highlightStyle: e.target.value },
                      }))
                    }
                  >
                    {["standard", "hero", "featured", "compact"].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {form.type === "sale" && (
                <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 space-y-3">
                  <p className="font-bold text-[18px] text-[#333333]">Sale</p>
                  <select
                    className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                    value={form.saleConfig.discountType}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        saleConfig: { ...f.saleConfig, discountType: e.target.value },
                      }))
                    }
                  >
                    {DISCOUNT_TYPES.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                    value={form.saleConfig.discountValue}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        saleConfig: { ...f.saleConfig, discountValue: e.target.value },
                      }))
                    }
                  />
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.saleConfig.showSaleBadge}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          saleConfig: { ...f.saleConfig, showSaleBadge: e.target.checked },
                        }))
                      }
                    />
                    Show sale badge
                  </label>
                  <input
                    placeholder="Badge label"
                    className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                    value={form.saleConfig.badgeLabel}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        saleConfig: { ...f.saleConfig, badgeLabel: e.target.value },
                      }))
                    }
                  />
                </div>
              )}

              {form.type === "banner" && (
                <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 space-y-3">
                  <p className="font-bold text-[18px] text-[#333333]">Banner</p>
                  <input
                    placeholder="Headline"
                    className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                    value={form.bannerConfig.headline}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        bannerConfig: { ...f.bannerConfig, headline: e.target.value },
                      }))
                    }
                  />
                  <textarea
                    placeholder="Subheadline"
                    className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                    value={form.bannerConfig.subheadline}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        bannerConfig: { ...f.bannerConfig, subheadline: e.target.value },
                      }))
                    }
                  />
                  <input
                    placeholder="Button label"
                    className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                    value={form.bannerConfig.buttonLabel}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        bannerConfig: { ...f.bannerConfig, buttonLabel: e.target.value },
                      }))
                    }
                  />
                  <select
                    className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                    value={form.bannerConfig.buttonType}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        bannerConfig: { ...f.bannerConfig, buttonType: e.target.value },
                      }))
                    }
                  >
                    {CTA_TYPES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <input
                    placeholder="Button target"
                    className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                    value={form.bannerConfig.buttonTarget}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        bannerConfig: { ...f.bannerConfig, buttonTarget: e.target.value },
                      }))
                    }
                  />
                  <input
                    placeholder="Theme"
                    className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                    value={form.bannerConfig.theme}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        bannerConfig: { ...f.bannerConfig, theme: e.target.value },
                      }))
                    }
                  />
                  <select
                    className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                    value={form.bannerConfig.textAlignment}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        bannerConfig: { ...f.bannerConfig, textAlignment: e.target.value },
                      }))
                    }
                  >
                    {["left", "center", "right"].map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {form.type === "coupon" && (
                <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 space-y-3">
                  <p className="font-bold text-[18px] text-[#333333]">Coupon</p>
                  <input
                    placeholder="Code *"
                    className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm font-mono uppercase"
                    value={form.couponConfig.code}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        couponConfig: { ...f.couponConfig, code: e.target.value },
                      }))
                    }
                  />
                  <select
                    className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                    value={form.couponConfig.discountType}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        couponConfig: { ...f.couponConfig, discountType: e.target.value },
                      }))
                    }
                  >
                    {COUPON_DISCOUNT_TYPES.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                    value={form.couponConfig.discountValue}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        couponConfig: { ...f.couponConfig, discountValue: e.target.value },
                      }))
                    }
                  />
                  <input
                    type="number"
                    placeholder="Minimum order"
                    className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                    value={form.couponConfig.minimumOrderAmount}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        couponConfig: { ...f.couponConfig, minimumOrderAmount: e.target.value },
                      }))
                    }
                  />
                  <input
                    type="number"
                    placeholder="Usage limit (optional)"
                    className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                    value={form.couponConfig.usageLimit}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        couponConfig: { ...f.couponConfig, usageLimit: e.target.value },
                      }))
                    }
                  />
                  <input
                    type="number"
                    placeholder="Per customer limit (optional)"
                    className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                    value={form.couponConfig.perCustomerLimit}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        couponConfig: { ...f.couponConfig, perCustomerLimit: e.target.value },
                      }))
                    }
                  />
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.couponConfig.firstOrderOnly}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          couponConfig: { ...f.couponConfig, firstOrderOnly: e.target.checked },
                        }))
                      }
                    />
                    First order only
                  </label>
                </div>
              )}

              {form.type === "deal" && (
                <>
                  <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 space-y-3">
                    <p className="font-bold text-[18px] text-[#333333]">Deal</p>
                    <select
                      className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                      value={form.dealConfig.dealType}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          dealConfig: { ...f.dealConfig, dealType: e.target.value },
                        }))
                      }
                    >
                      {DEAL_TYPES.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <input
                      placeholder="Promo label"
                      className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                      value={form.dealConfig.promoLabel}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          dealConfig: { ...f.dealConfig, promoLabel: e.target.value },
                        }))
                      }
                    />
                    <input
                      type="number"
                      placeholder="Minimum order"
                      className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
                      value={form.dealConfig.minimumOrderAmount}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          dealConfig: { ...f.dealConfig, minimumOrderAmount: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-[18px] text-[#333333]">Conditions</p>
                      <button
                        type="button"
                        className="text-sm font-semibold text-[#283618]"
                        onClick={() =>
                          setForm((f) => ({
                            ...f,
                            dealConditions: [
                              ...f.dealConditions,
                              { conditionType: "order_minimum", conditionValue: { amount: 0 } },
                            ],
                          }))
                        }
                      >
                        + Add condition
                      </button>
                    </div>
                    {form.dealConditions.map((c, i) => (
                      <div key={i} className="border border-[#F3F4F6] rounded-lg p-3 space-y-2">
                        <select
                          className="w-full rounded border border-[#E5E7EB] px-2 py-1 text-sm"
                          value={c.conditionType}
                          onChange={(e) => {
                            const next = [...form.dealConditions];
                            next[i] = { ...next[i], conditionType: e.target.value };
                            setForm((f) => ({ ...f, dealConditions: next }));
                          }}
                        >
                          {CONDITION_TYPES.map((x) => (
                            <option key={x} value={x}>
                              {x}
                            </option>
                          ))}
                        </select>
                        <textarea
                          className="w-full rounded border border-[#E5E7EB] px-2 py-1 text-xs font-mono"
                          rows={2}
                          placeholder='JSON value e.g. {"amount":25}'
                          value={
                            typeof c.conditionValue === "object"
                              ? JSON.stringify(c.conditionValue)
                              : String(c.conditionValue ?? "")
                          }
                          onChange={(e) => {
                            let v;
                            try {
                              v = JSON.parse(e.target.value);
                            } catch {
                              v = e.target.value;
                            }
                            const next = [...form.dealConditions];
                            next[i] = { ...next[i], conditionValue: v };
                            setForm((f) => ({ ...f, dealConditions: next }));
                          }}
                        />
                        <button
                          type="button"
                          className="text-xs text-red-600"
                          onClick={() =>
                            setForm((f) => ({
                              ...f,
                              dealConditions: f.dealConditions.filter((_, j) => j !== i),
                            }))
                          }
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-[18px] text-[#333333]">Rewards</p>
                      <button
                        type="button"
                        className="text-sm font-semibold text-[#283618]"
                        onClick={() =>
                          setForm((f) => ({
                            ...f,
                            dealRewards: [
                              ...f.dealRewards,
                              { rewardType: "percentage_discount", rewardValue: { percent: 10 } },
                            ],
                          }))
                        }
                      >
                        + Add reward
                      </button>
                    </div>
                    {form.dealRewards.map((r, i) => (
                      <div key={i} className="border border-[#F3F4F6] rounded-lg p-3 space-y-2">
                        <select
                          className="w-full rounded border border-[#E5E7EB] px-2 py-1 text-sm"
                          value={r.rewardType}
                          onChange={(e) => {
                            const next = [...form.dealRewards];
                            next[i] = { ...next[i], rewardType: e.target.value };
                            setForm((f) => ({ ...f, dealRewards: next }));
                          }}
                        >
                          {REWARD_TYPES.map((x) => (
                            <option key={x} value={x}>
                              {x}
                            </option>
                          ))}
                        </select>
                        <textarea
                          className="w-full rounded border border-[#E5E7EB] px-2 py-1 text-xs font-mono"
                          rows={2}
                          placeholder='JSON value e.g. {"percent":10}'
                          value={
                            typeof r.rewardValue === "object"
                              ? JSON.stringify(r.rewardValue)
                              : String(r.rewardValue ?? "")
                          }
                          onChange={(e) => {
                            let v;
                            try {
                              v = JSON.parse(e.target.value);
                            } catch {
                              v = e.target.value;
                            }
                            const next = [...form.dealRewards];
                            next[i] = { ...next[i], rewardValue: v };
                            setForm((f) => ({ ...f, dealRewards: next }));
                          }}
                        />
                        <button
                          type="button"
                          className="text-xs text-red-600"
                          onClick={() =>
                            setForm((f) => ({
                              ...f,
                              dealRewards: f.dealRewards.filter((_, j) => j !== i),
                            }))
                          }
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {step > 1 && (
            <div className="flex flex-wrap gap-2 pb-8">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(isEdit ? 2 : 1, s - 1))}
                className="rounded-xl border border-[#E5E7EB] px-4 py-2 text-sm font-semibold"
              >
                Back
              </button>
              {step < 6 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.min(6, s + 1))}
                  className="rounded-xl bg-[#283618] text-white px-4 py-2 text-sm font-semibold"
                >
                  Next
                </button>
              )}
              {step === 6 && (
                <>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => submit(false)}
                    className="rounded-xl border border-[#283618] text-[#283618] px-4 py-2 text-sm font-semibold"
                  >
                    Save draft
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => submit(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#283618] text-white px-4 py-2 text-sm font-semibold"
                  >
                    <FontAwesomeIcon icon={faCheck} />
                    Save & publish
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-4 self-start">
          <p className="text-xs font-semibold text-[#6B7280] uppercase mb-2">Live preview</p>
          <PromotionPreviewPanel promotion={previewDoc} maps={maps} compact />
        </div>
      </div>
    </>
  );
}
