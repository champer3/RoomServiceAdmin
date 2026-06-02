import moment from "moment";
// import { PRODUCT_LIST } from "../assets/data";c
import Path from "../components/Path";
import TableHead from "../components/dashboard_components/TableHead";
import { useContext, useEffect, useMemo, useState } from "react";
import OrangeLabel from "../components/StatusLabels/OrangeLabel";
import StyledDashboardButton from "../components/dashboard_components/StyledDashboardButton";
import MiniSearch from "../components/MiniSearch";
import FilterButton from "../components/FilterButton";
import ProductsFilterDrawer from "../components/ProductsFilterDrawer";
import SelectDatesButton from "../components/SelectDatesButton";
import { Link } from "react-router-dom";
import GreenLabel from "../components/StatusLabels/GreenLabel";
import GreyLabel from "../components/StatusLabels/GreyLabel";
import { PageContext } from "../context/PageContext";
import axios from "axios";
import Toast from "../components/Toast";
import Alert from "../components/Alert";
import TableEmptyState from "../components/TableEmptyState";
import { API_URL } from '../config';

const PRODUCTS_ITEMS_PER_PAGE_KEY = "admin:productsItemsPerPage";
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

function formatNumberWithCommas(number) {
  const formattedNumber = parseFloat(number.toFixed(2)).toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );

  return formattedNumber;
}
function capitalizeWords(str) {
  return str.toLowerCase().split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

function formatDate(dateObject) {
  return moment(dateObject).format("D MMM YYYY");
}

const getAllProducts = async () => {
  try {
    const products = await axios.get(
      `${API_URL}/api/v1/products`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(products)
    return products;
  } catch (err) {
    console.log(err);
  }
};

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterDepartment, setFilterDepartment] = useState(null); // null = All, else department _id
  const [filterCategoryIds, setFilterCategoryIds] = useState([]);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilters, setStatusFilters] = useState([]); // [] = all
  const [visibilityFilters, setVisibilityFilters] = useState([]); // [] = all
  const [stockFilters, setStockFilters] = useState([]); // [] = all
  const [priceRange, setPriceRange] = useState({ min: "", max: "" }); // both empty = no filter
  const [sortBy, setSortBy] = useState("newest"); // newest | name_az | price_low | stock_low
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAllProducts()
      .then((data) => data)
      .then((data) => {
        setAllProducts((data?.data?.data?.products || []).reverse());
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/departments`)
      .then((res) => res.json())
      .then((json) => setDepartments(json.data?.departments || []))
      .catch(() => setDepartments([]));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/categories`)
      .then((res) => res.json())
      .then((json) => setCategories(json.data?.categories || []))
      .catch(() => setCategories([]));
  }, []);

  // Map category id -> { name, departmentId } for products that have category as id only
  const categoryMap = useMemo(() => {
    const map = {};
    (categories || []).forEach((cat) => {
      const id = cat._id ?? cat.id;
      if (id) {
        const deptId = cat.department?._id ?? cat.department;
        map[String(id)] = {
          name: cat.name,
          departmentId: deptId ? String(deptId) : null,
          isActive: cat.isActive,
        };
      }
    });
    return map;
  }, [categories]);

  const getCategoryName = (product) => {
    const cat = product.category;
    if (cat && typeof cat === "object" && cat.name) return cat.name;
    return categoryMap[String(cat)]?.name ?? "—";
  };

  const getCategoryIsActive = (product) => {
    const cat = product?.category;
    if (cat && typeof cat === "object" && "isActive" in cat) return cat.isActive;
    const cid = getProductCategoryId(product);
    if (!cid) return undefined;
    return categoryMap[String(cid)]?.isActive;
  };

  const getProductDepartmentId = (product) => {
    const cat = product.category;
    if (cat && typeof cat === "object") {
      const d = cat.department?._id ?? cat.department;
      return d ? String(d) : null;
    }
    return categoryMap[String(cat)]?.departmentId ?? null;
  };

  const getProductCategoryId = (product) => {
    const cat = product.category;
    if (!cat) return null;
    return String(typeof cat === "object" ? cat._id ?? cat.id : cat);
  };

  // Rule 1: When department changes, clear invalid category selection
  useEffect(() => {
    setFilterCategoryIds([]);
  }, [filterDepartment]);

  // Categories for drawer dropdown: only those in selected department (or all if no department)
  const categoriesByDepartment = useMemo(() => {
    if (!filterDepartment) return categories || [];
    return (categories || []).filter((c) => {
      const deptId = c.department?._id ?? c.department;
      return deptId && String(deptId) === String(filterDepartment);
    });
  }, [categories, filterDepartment]);

  const priceBounds = useMemo(() => {
    const prices = (allProducts || [])
      .map((p) => (p?.price == null ? null : Number(p.price)))
      .filter((n) => Number.isFinite(n) && n >= 0);

    if (prices.length === 0) {
      return { min: 0, max: 100000, step: 1000 };
    }

    const rawMin = Math.min(...prices);
    const rawMax = Math.max(...prices);

    // Round bounds for a nicer slider experience.
    const min = Math.floor(rawMin / 100) * 100;
    const max = Math.ceil(rawMax / 100) * 100;
    const safeMax = Math.max(max, min + 100);

    // Choose a step that keeps the slider responsive.
    const span = safeMax - min;
    const step = span > 200000 ? 1000 : span > 80000 ? 500 : 100;

    return { min, max: safeMax, step };
  }, [allProducts]);

  // Rule 2: Filters stack — apply department, category, search, status, stock; then sort
  const productList = useMemo(() => {
    let list = allProducts;

    if (filterDepartment != null) {
      const sid = String(filterDepartment);
      list = list.filter((p) => getProductDepartmentId(p) === sid);
    }
    if (filterCategoryIds.length > 0) {
      const set = new Set(filterCategoryIds.map((id) => String(id)));
      list = list.filter((p) => {
        const cid = getProductCategoryId(p);
        return cid && set.has(String(cid));
      });
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((p) => {
        const deptId = getProductDepartmentId(p);
        const dept = departments.find((d) => String(d._id ?? d.id) === String(deptId)) || null;
        const deptSlug = dept?.slug || dept?.name?.toLowerCase?.() || "";

        const metadata = p?.metadata && typeof p.metadata === "object" ? p.metadata : {};

        const addCandidate = (arr, v) => {
          if (v == null) return;
          if (typeof v === "string" || typeof v === "number") {
            arr.push(String(v));
            return;
          }
          if (Array.isArray(v)) {
            v.forEach((item) => addCandidate(arr, item));
            return;
          }
          if (typeof v === "object") {
            if ("name" in v) addCandidate(arr, v.name);
            else if ("title" in v) addCandidate(arr, v.title);
          }
        };

        const candidates = [];
        if (Array.isArray(p.tags)) addCandidate(candidates, p.tags);

        // Department-aware search fields
        const keysByDept = {
          food: ["ingredients", "brand", "brands"],
          grocery: ["ingredients", "brand", "brands"],
          household: ["brand", "brands"],
        };
        const keys = keysByDept[deptSlug] || ["ingredients", "brand", "brands"];

        keys.forEach((k) => addCandidate(candidates, metadata[k]));

        const title = (p.title || "").toLowerCase();
        const sku = (p.sku || "").toLowerCase();
        const id = (p._id || p.id || "").toLowerCase();
        const catName = getCategoryName(p).toLowerCase();

        const hit =
          title.includes(q) ||
          sku.includes(q) ||
          id.includes(q) ||
          catName.includes(q) ||
          candidates.some((c) => String(c).toLowerCase().includes(q));

        return hit;
      });
    }
    if (statusFilters.length > 0) {
      const wantActive = statusFilters.includes("active");
      const wantInactive = statusFilters.includes("inactive");
      list = list.filter((p) => {
        return (
          (wantActive && p.availability === true) || (wantInactive && p.availability === false)
        );
      });
    }

    if (visibilityFilters.length > 0) {
      const wantVisible = visibilityFilters.includes("visible");
      const wantHidden = visibilityFilters.includes("hidden");
      list = list.filter((p) => {
        const categoryHidden = getCategoryIsActive(p) === false;
        const matchesVisible = wantVisible && categoryHidden !== true;
        const matchesHidden = wantHidden && categoryHidden === true;
        return matchesVisible || matchesHidden;
      });
    }

    if (stockFilters.length > 0) {
      const wantInStock = stockFilters.includes("in_stock");
      const wantLowStock = stockFilters.includes("low_stock");
      const wantOutOfStock = stockFilters.includes("out_of_stock");

      list = list.filter((p) => {
        const stockRaw = p.stock ?? null;
        const stock = stockRaw == null ? 0 : Number(stockRaw);
        const thresholdRaw = p.lowStockThreshold ?? 10;
        const threshold = Number(thresholdRaw);
        const safeThreshold = Number.isFinite(threshold) && threshold >= 0 ? threshold : 10;

        const lowStock = stock > 0 && safeThreshold > 0 && stock < safeThreshold;
        const inStock = stock > 0 && !lowStock;
        const outOfStock = !Number.isFinite(stock) || stock === 0;

        return (
          (wantInStock && inStock) ||
          (wantLowStock && lowStock) ||
          (wantOutOfStock && outOfStock)
        );
      });
    }

    // Price range filter (AND with other groups; treat min/max independently)
    const min = priceRange.min === "" ? null : Number(priceRange.min);
    const max = priceRange.max === "" ? null : Number(priceRange.max);
    if ((min != null && Number.isFinite(min)) || (max != null && Number.isFinite(max))) {
      list = list.filter((p) => {
        const priceRaw = p?.price ?? null;
        const price = priceRaw == null ? null : Number(priceRaw);
        if (price == null || !Number.isFinite(price)) return false;
        const matchesMin = min == null ? true : price >= min;
        const matchesMax = max == null ? true : price <= max;
        return matchesMin && matchesMax;
      });
    }

    const sorted = [...list];
    if (sortBy === "newest") sorted.sort((a, b) => (b._id || b.id || "").localeCompare(a._id || a.id || ""));
    else if (sortBy === "name_az") sorted.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    else if (sortBy === "price_low") sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    else if (sortBy === "stock_low") sorted.sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0));
    return sorted;
  }, [
    allProducts,
    filterDepartment,
    filterCategoryIds,
    searchQuery,
    statusFilters,
    visibilityFilters,
    stockFilters,
    priceRange,
    sortBy,
    categoryMap,
    departments,
  ]);

  const countAll = allProducts.length;
  const countByDepartment = (deptId) => {
    if (!deptId) return countAll;
    const sid = String(deptId);
    return allProducts.filter((p) => getProductDepartmentId(p) === sid).length;
  };

  const [itemsPerPage, setItemsPerPage] = useState(() =>
    readStoredItemsPerPage(PRODUCTS_ITEMS_PER_PAGE_KEY)
  );
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeColumn, setActiveColumn] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState();
  const [productToDelete, setProductToDelete] = useState(null);
  const pagedProducts = productList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filterDepartment, filterCategoryIds, searchQuery, statusFilters, visibilityFilters, stockFilters, priceRange, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  function persistItemsPerPage(n) {
    try {
      localStorage.setItem(PRODUCTS_ITEMS_PER_PAGE_KEY, String(n));
    } catch {
      /* ignore */
    }
  }

  const appliedFilterCount =
    filterCategoryIds.length +
    statusFilters.length +
    visibilityFilters.length +
    stockFilters.length +
    (priceRange.min !== "" || priceRange.max !== "" ? 1 : 0) +
    (sortBy !== "newest" ? 1 : 0);

  const lastPage = productList
    ? productList.length % itemsPerPage === 0
      ? productList.length / itemsPerPage
      : Math.floor(productList.length / itemsPerPage) + 1
    : null;

  const arr = [];
  for (let i = 1; i <= lastPage; i++) {
    arr.push(i);
  }
  const { changePage } = useContext(PageContext);

  // const shownItems = productList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  // productList.sort((a,b) => a['name'].localeCompare(b['name']))

  function handlePageClick(pageNum) {
    setCurrentPage(pageNum);
  }

  function handleAscendingSort(criteria) {
    setActiveColumn(criteria);
    // if (criteria === "status" || criteria === "name") {
    //   setShownItems((prevList) => {
    //     prevList.sort((a, b) => a[criteria].localeCompare(b[criteria]));
    //     return [...prevList];
    //   });
    // } else {
    //   setShownItems((prevList) => {
    //     prevList.sort((a, b) => a[criteria] - b[criteria]);
    //     return [...prevList];
    //   });
    // }
  }

  function handleDescendingSort(criteria) {
    setActiveColumn(criteria);
    if (criteria === "status" || criteria === "name") {
      //   setShownItems((prevList) => {
      //     prevList.sort((a, b) => b[criteria].localeCompare(a[criteria]));
      //     return [...prevList];
      //   });
      // } else {
      //   setShownItems((prevList) => {
      //     prevList.sort((a, b) => b[criteria] - a[criteria]);
      //     return [...prevList];
      //   });
    }
  }
  async function deleteProduct(id){
    try {
      const response = await axios.delete(`${API_URL}/api/v1/products/${id}`,
          {
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MmY5MTQ1ZGEzYmQ3ZmUzMTU5YzU1MyIsImlhdCI6MTcyNTAzNDYxOCwiZXhwIjoxNzI1ODk4NjE4fQ.xcFoMC9joIY-ChhTZZBGsvyfGtgz-SSQxYDnMe_4kVI'}`,
              },

          });
        setMessage({'status': 'Success', 'text': 'Successfully deleted product', 'color': 'success'});
        setProductToDelete(null);
        setAllProducts((prev) => prev.filter((item) => item._id !== id && item.id !== id));
        // If an edit draft exists for this product, remove it to avoid stale/unused localStorage.
        try {
          localStorage.removeItem(`admin:editProductDraft:v1:${id}`);
        } catch (_) {}
  } catch (error) {
      console.error('Error deleting product:', error);
      setMessage({'status': 'Error', 'text': 'Error deleting product', 'color': 'warning'});
      setProductToDelete(null);
  }
  }


  function handleIsSelected(row) {
    setSelectedRows((prevState) => {
      return [...prevState, row];
    });
  }
  useEffect(()=>{
    setTimeout(()=>{setMessage()}, 4000)
}, [message])

  function handleIsRemoved(row) {
    setSelectedRows((prevState) => {
      return prevState.filter((item) => item !== row);
    });
  }
  // console.log(selectedRows);
  // console.log(productList);
  return (
    <div className="flex flex-col flex-1 min-h-0">
      {loading && <p className="text-[#6B7280] font-medium">Loading products…</p>}
      {!loading && (
        <>
          <Toast
            open={!!message}
            onClose={() => setMessage(undefined)}
            message={message?.text ?? ""}
            title={message?.status}
            type={message?.color === "success" ? "success" : "warning"}
            autoHideDuration={5000}
          />
          {productToDelete && (
            <Alert
              variant="warning"
              title={`Delete "${productToDelete.title || "this product"}"?`}
              onDismiss={() => setProductToDelete(null)}
            >
              <p className="mb-3">This will permanently delete this product. This action cannot be undone.</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setProductToDelete(null)}
                  className="px-3 py-1.5 rounded-lg border border-[#C2410C] text-[#C2410C] font-medium text-[14px] hover:bg-[#FFF7ED]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => deleteProduct(productToDelete._id)}
                  className="px-3 py-1.5 rounded-lg bg-[#C2410C] text-white font-medium text-[14px] hover:bg-[#9A3412]"
                >
                  Delete
                </button>
              </div>
            </Alert>
          )}
          {changePage("products")}
          <ProductsFilterDrawer
            open={filterDrawerOpen}
            onClose={() => setFilterDrawerOpen(false)}
            statusFilters={statusFilters}
            setStatusFilters={setStatusFilters}
            visibilityFilters={visibilityFilters}
            setVisibilityFilters={setVisibilityFilters}
            stockFilters={stockFilters}
            setStockFilters={setStockFilters}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            priceBounds={priceBounds}
            sortBy={sortBy}
            setSortBy={setSortBy}
            filterCategoryIds={filterCategoryIds}
            setFilterCategoryIds={setFilterCategoryIds}
            categoriesByDepartment={categoriesByDepartment}
            onReset={() => {
              setStatusFilters([]);
              setVisibilityFilters([]);
              setStockFilters([]);
              setPriceRange({ min: "", max: "" });
              setSortBy("newest");
              setFilterCategoryIds([]);
            }}
          />
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 min-h-0 overflow-y-auto flex flex-col">
              <div className="flex flex-col  min-h-0">
            {/* Header row */}
            <div className="flex items-center">
              <div>
                <p className="text-[#333333] font-bold text-[28px] leading-[42px] tracking-[0.01em]">
                  Products
                </p>
                <p className="mt-1 text-[15px] text-[#6B7280] font-normal">Manage all your products</p>
              </div>
              <div className="flex ml-auto">
                <button className="flex items-center border border-[#283618] rounded-xl mr-2 px-[14px] py-[10px] text-[#283618] font-semibold text-[14px] leading-[20px] tracking-[0.005em] bg-white hover:bg-[#F4F9EE]">
                  <svg
                    className="mr-2"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_499_3317)">
                      <path
                        d="M6.5854 12.0813C7.36621 12.8627 8.63253 12.8631 9.41384 12.0822C9.41415 12.0819 9.41443 12.0817 9.41474 12.0813L11.5554 9.94069C11.8023 9.66759 11.7811 9.246 11.508 8.99906C11.2537 8.76916 10.8666 8.76956 10.6127 9L8.66209 10.9513L8.66674 0.666687C8.66671 0.298469 8.36824 0 8.00006 0C7.63187 0 7.3334 0.298469 7.3334 0.666656L7.3274 10.9387L5.3874 9C5.1269 8.73969 4.70471 8.73984 4.4444 9.00034C4.18409 9.26084 4.18424 9.68303 4.44474 9.94334L6.5854 12.0813Z"
                        fill="#283618"
                      />
                      <path
                        d="M15.3333 10.6666C14.9652 10.6666 14.6667 10.9651 14.6667 11.3333V14C14.6667 14.3682 14.3682 14.6666 14 14.6666H2C1.63181 14.6666 1.33334 14.3682 1.33334 14V11.3333C1.33334 10.9651 1.03487 10.6667 0.666687 10.6667C0.298469 10.6666 0 10.9651 0 11.3333V14C0 15.1045 0.895437 16 2 16H14C15.1046 16 16 15.1045 16 14V11.3333C16 10.9651 15.7015 10.6666 15.3333 10.6666Z"
                        fill="#283618"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_499_3317">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  Export
                </button>
                <Link to={"/add-products"}>
                  <button className="flex items-center rounded-xl px-[14px] py-[10px] bg-[#283618] hover:bg-[#1F2714] text-white font-semibold text-[14px] leading-[20px] tracking-[0.005em] shadow-sm">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_499_3320)">
                        <path
                          d="M17.3333 9.33333H10.6667V2.66667C10.6667 2.48986 10.5964 2.32029 10.4714 2.19526C10.3464 2.07024 10.1768 2 10 2V2C9.82319 2 9.65362 2.07024 9.5286 2.19526C9.40357 2.32029 9.33333 2.48986 9.33333 2.66667V9.33333H2.66667C2.48986 9.33333 2.32029 9.40357 2.19526 9.5286C2.07024 9.65362 2 9.82319 2 10V10C2 10.1768 2.07024 10.3464 2.19526 10.4714C2.32029 10.5964 2.48986 10.6667 2.66667 10.6667H9.33333V17.3333C9.33333 17.5101 9.40357 17.6797 9.5286 17.8047C9.65362 17.9298 9.82319 18 10 18C10.1768 18 10.3464 17.9298 10.4714 17.8047C10.5964 17.6797 10.6667 17.5101 10.6667 17.3333V10.6667H17.3333C17.5101 10.6667 17.6797 10.5964 17.8047 10.4714C17.9298 10.3464 18 10.1768 18 10C18 9.82319 17.9298 9.65362 17.8047 9.5286C17.6797 9.40357 17.5101 9.33333 17.3333 9.33333Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_499_3320">
                          <rect
                            width="16"
                            height="16"
                            fill="white"
                            transform="translate(2 2)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                    <p className="ml-2">Add Product</p>
                  </button>
                </Link>
              </div>
            </div>
            {/* Department tabs — All (count), Food (count), etc. */}
            <div className="mb-6 flex items-end gap-1 text-sm border-b border-[#E5E7EB]">
              <button
                type="button"
                onClick={() => setFilterDepartment(null)}
                className={`pb-2 border-b-2 -mb-px font-medium transition-colors ${
                  filterDepartment == null
                    ? "text-[#283618] border-[#283618] bg-nav-active-bg rounded-t-lg px-4 pt-2"
                    : "text-[#6B7280] border-transparent hover:text-[#374151] px-4 pt-2"
                }`}
              >
                All <span className={filterDepartment == null ? "text-[#283618]/80 font-normal" : "text-[#6B7280] font-normal"}>({countAll})</span>
              </button>
              {departments.map((d) => {
                const count = countByDepartment(d._id);
                const isActive = filterDepartment === d._id;
                return (
                  <button
                    key={d._id}
                    type="button"
                    onClick={() => setFilterDepartment(d._id)}
                    className={`pb-2 border-b-2 -mb-px font-medium transition-colors ${
                      isActive
                        ? "text-[#283618] border-[#283618] bg-nav-active-bg rounded-t-lg px-4 pt-2"
                        : "text-[#6B7280] border-transparent hover:text-[#374151] px-4 pt-2"
                    }`}
                  >
                    {d.name} <span className={isActive ? "text-[#283618]/80 font-normal" : "text-[#6B7280] font-normal"}>({count})</span>
                  </button>
                );
              })}
               <div className="flex items-center mb-2  space-x-3 ml-auto">
                  <MiniSearch searchItem="products" value={searchQuery} onChange={setSearchQuery} />
                  <FilterButton
                    onClick={() => setFilterDrawerOpen(true)}
                    active={appliedFilterCount > 0}
                    appliedCount={appliedFilterCount}
                  />
                </div>
            </div>

              {/* Summary cards row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center rounded-2xl bg-white px-4 py-3 shadow-sm border border-[#E5E7EB]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F0FDF4] text-[#16A34A] mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.5 6.5L10 10l7.5-3.5-7.5-3.5L2.5 6.5z" />
                      <path d="M2.5 8.25V13.5L9.5 17v-5.25L2.5 8.25zM10.5 17l7-3.5V8.25l-7 3.5V17z" />
                    </svg>
                  </div>
                  <div>
                      <p className="text-[28px] font-bold text-[#111827] mb-1">
                      {productList.length}
                    </p>
                    <p className="text-sm font-semibold text-[#6B7280]">
                      Total Products
                    </p>
            
                  </div>
                </div>
                <div className="flex items-center rounded-2xl bg-white px-4 py-3 shadow-sm border border-[#E5E7EB]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF6FF] text-[#2563EB] mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div>
                  <p className="text-[28px] font-bold text-[#111827]">
                      {productList.filter((p) => p.availability).length}
                    </p>
                    <p className="text-sm font-semibold text-[#6B7280]">
                      Active Items
                    </p>
                 
                  </div>
                </div>
                <div className="flex items-center rounded-2xl bg-white px-4 py-3 shadow-sm border border-[#E5E7EB]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFFBEB] text-[#D97706] mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M3 3a1 1 0 000 2h1.22l1.52 7.61A2 2 0 007.7 14h6.6a2 2 0 001.97-1.64l1.1-5.5A1 1 0 0016.4 6H6.56l-.3-1.53A2 2 0 004.23 3H3z" />
                      <path d="M7 16a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[28px] font-bold text-[#111827] mb-1">
                      {productList.filter((p) => !p.availability).length}
                    </p>
                    <p className="text-sm font-semibold text-[#6B7280]">
                      Draft Items
                    </p>
                  </div>
                </div>
                <div className="flex items-center rounded-2xl bg-white px-4 py-3 shadow-sm border border-[#E5E7EB]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF6FF] text-[#2563EB] mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M4 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zM9 7a1 1 0 00-1 1v8a1 1 0 102 0V8a1 1 0 00-1-1zM14 5a1 1 0 00-1 1v10a1 1 0 102 0V6a1 1 0 00-1-1z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[28px] font-bold text-[#111827] mb-1">
                      {productList.filter((p) => p.stock < 10).length}
                    </p>
                    <p className="text-sm font-semibold text-[#6B7280]">
                      Low Stock (&lt; 10)
                    </p>
                  </div>
                </div>
              </div>

              {/* Filters row */}
              <div className="flex flex-wrap items-center gap-3">
      
              
              </div>
              </div>

            {/* Table: single table so header and body columns align; sticky header, body scrolls */}
            <div className="mt-1 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm overflow-hidden flex-1 min-h-0 flex flex-col min-h-[420px] ">
              <div className="flex-1 min-h-0 overflow-y-auto min-h-[380px]">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 z-10 bg-[#F9FAFB] border-b border-[#E5E7EB] shadow-[0_1px_0_0_#E5E7EB]">
                    <tr>
                      <th className="w-10 px-4 py-1 text-left">
                        <button>
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="20" height="20" rx="6" fill="#BC6C25" />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M3.75 10C3.75 9.53978 4.1231 9.16669 4.58333 9.16669H15.4167C15.8769 9.16669 16.25 9.53978 16.25 10C16.25 10.4603 15.8769 10.8334 15.4167 10.8334H4.58333C4.1231 10.8334 3.75 10.4603 3.75 10Z"
                              fill="white"
                            />
                          </svg>
                        </button>
                      </th>
                      <th className="px-4 py-1 text-left">
                        <TableHead
                          heading={"Product"}
                          active={activeColumn === "name"}
                          canOrder={true}
                          ascend={() => handleAscendingSort("name")}
                          descend={() => handleDescendingSort("name")}
                        />
                      </th>
                      <th className="px-4 py-1 text-left">
                        <TableHead heading={"Category"} />
                      </th>
                      <th className="px-4 py-1 text-left">
                        <TableHead heading={"Price"} />
                      </th>
                      <th className="px-4 py-1 text-left">
                        <TableHead heading={"Stock"} />
                      </th>
                      <th className="px-4 py-1 text-left">
                        <TableHead heading={"Status"} />
                      </th>
                      <th className="px-4 py-1 text-left">
                        <TableHead heading={"Added"} />
                      </th>
                      <th className="px-4 py-1 text-left pr-6">
                        <TableHead heading={"Actions"} />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedProducts.map((product, index) => (
                      <tr
                        key={index}
                        className={`border-b border-[#F3F4F6] ${
                          selectedRows.indexOf(product._id) !== -1
                            ? "bg-[#F9FAFB]"
                            : "bg-white"
                        } hover:bg-[#F9FAFB] transition-colors ${
                          getCategoryIsActive(product) === false ? "opacity-80" : ""
                        }`}
                      >
                        <td className="px-4 py-3 align-middle">
                          {selectedRows.indexOf(product._id) === -1 ? (
                            <button
                              onClick={() => handleIsSelected(product._id)}
                            >
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="1"
                                  y="1"
                                  width="18"
                                  height="18"
                                  rx="5"
                                  fill="white"
                                  stroke="#CBD5E1"
                                  strokeWidth="2"
                                />
                              </svg>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleIsRemoved(product._id)}
                            >
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  width="20"
                                  height="20"
                                  rx="6"
                                  fill="#BC6C25"
                                />
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M15.947 4.77386C16.302 5.06675 16.3523 5.59197 16.0594 5.94699L8.91034 14.6126C8.76045 14.7943 8.48987 14.8157 8.31326 14.6598L4.44862 11.2499C4.10351 10.9454 4.0706 10.4188 4.3751 10.0737C4.67961 9.72855 5.20622 9.69563 5.55132 10.0001L8.44704 12.5552L14.7738 4.88635C15.0667 4.53134 15.5919 4.48097 15.947 4.77386Z"
                                  fill="white"
                                />
                              </svg>
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-3 align-middle">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-lg bg-[#F9FAFB] flex items-center justify-center overflow-hidden">
                              <img
                                src={product.images ? product.images[0] : ""}
                                alt=""
                                className={[
                                  "h-10 w-10 object-cover transition",
                                  getCategoryIsActive(product) === false ? "grayscale blur-[1px] brightness-90" : "",
                                ].join(" ")}
                              />
                            </div>
                            <div className="ml-3 min-w-0">
                              <p className="text-[14px] font-semibold text-[#111827] truncate">
                                {capitalizeWords(product.title)}
                              </p>
                              <p className="mt-0.5 text-[12px] text-[#6B7280]">
                                #{product._id.slice(0, 6)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 align-middle text-[13px] text-[#4B5563]">
                          {getCategoryName(product)}
                        </td>
                        <td className="px-4 py-3 align-middle text-[13px] font-semibold text-[#111827]">
                          ${formatNumberWithCommas(product.price)}
                        </td>
                        <td className="px-4 py-3 align-middle">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              product.stock < 10
                                ? "bg-[#FEF3C7] text-[#B45309]"
                                : "bg-[#F3F4F6] text-[#374151]"
                            }`}
                          >
                            {product.stock} in stock
                          </span>
                        </td>
                        <td className="px-4 py-3 align-middle">
                          <div className="flex items-center gap-2">
                            {product.availability ? (
                              <GreenLabel>Active</GreenLabel>
                            ) : (
                              <OrangeLabel>Inactive</OrangeLabel>
                            )}
                            {getCategoryIsActive(product) === false && (
                              <GreyLabel>Hidden</GreyLabel>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 align-middle text-[13px] text-[#6B7280]">
                          {formatDate(product.dateAdded ?? product.createdAt)}
                        </td>
                        <td className="px-4 py-3 align-middle text-right pr-6">
                          <div className="inline-flex items-center space-x-2">
                            <Link to={`/edit-product/${product._id}`}>
                              <button className="p-1.5 rounded-full hover:bg-[#F3F4F6]">
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g clipPath="url(#clip0_578_3577)">
                                    <path
                                      d="M0.781333 12.7458C0.281202 13.2458 0.000151033 13.9239 0 14.6311L0 15.9998H1.36867C2.07585 15.9996 2.75402 15.7186 3.254 15.2184L12.1493 6.32313L9.67667 3.85046L0.781333 12.7458Z"
                                      fill="#6B7280"
                                    />
                                    <path
                                      d="M15.4299 0.570117C15.2675 0.407607 15.0747 0.278687 14.8626 0.190728C14.6504 0.102769 14.4229 0.0574951 14.1932 0.0574951C13.9635 0.0574951 13.736 0.102769 13.5239 0.190728C13.3117 0.278687 13.1189 0.407607 12.9565 0.570117L10.6192 2.90812L13.0919 5.38078L15.4299 3.04345C15.5924 2.88111 15.7213 2.68833 15.8093 2.47614C15.8972 2.26394 15.9425 2.03649 15.9425 1.80678C15.9425 1.57708 15.8972 1.34963 15.8093 1.13743C15.7213 0.925236 15.5924 0.732457 15.4299 0.570117Z"
                                      fill="#6B7280"
                                    />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_578_3577">
                                      <rect width="16" height="16" fill="white" />
                                    </clipPath>
                                  </defs>
                                </svg>
                              </button>
                            </Link>
                            <button
                              type="button"
                              onClick={() => setProductToDelete(product)}
                              className="p-1.5 rounded-full hover:bg-[#FEF2F2]"
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M14 2.66666H11.9334C11.6144 1.11572 10.2501 0.002 8.66669 0H7.33334C5.74994 0.002 4.38562 1.11572 4.06669 2.66666H2.00003C1.63184 2.66666 1.33337 2.96513 1.33337 3.33331C1.33337 3.7015 1.63184 4 2.00003 4H2.66669V12.6667C2.66891 14.5067 4.16 15.9978 6.00003 16H10C11.8401 15.9978 13.3312 14.5067 13.3334 12.6667V4H14C14.3682 4 14.6667 3.70153 14.6667 3.33334C14.6667 2.96516 14.3682 2.66666 14 2.66666ZM7.33337 11.3333C7.33337 11.7015 7.0349 12 6.66672 12C6.2985 12 6.00003 11.7015 6.00003 11.3333V7.33334C6.00003 6.96516 6.2985 6.66669 6.66669 6.66669C7.03487 6.66669 7.33334 6.96516 7.33334 7.33334V11.3333H7.33337ZM10 11.3333C10 11.7015 9.70156 12 9.33337 12C8.96519 12 8.66672 11.7015 8.66672 11.3333V7.33334C8.66672 6.96516 8.96519 6.66669 9.33337 6.66669C9.70156 6.66669 10 6.96516 10 7.33334V11.3333ZM5.44737 2.66666C5.73094 1.86819 6.48606 1.33434 7.33337 1.33331H8.66672C9.51403 1.33434 10.2692 1.86819 10.5527 2.66666H5.44737Z"
                                  fill="#DC2626"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {pagedProducts.length === 0 && (
                      <tr>
                        <td className="px-4 py-6" colSpan={8}>
                          <TableEmptyState
                            title="No products found"
                            description="Try adjusting filters or add a new product."
                            compact
                          />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {productList.length > 0 && (
              <div className="shrink-0  bg-white w-full p-4 flex items-center border-t border-[#F0F1F3] bg-panel-bg">
                <p className="font-semibold text-[14px] text-customGrey leading-[20px] tracking-[0.005em]">
                  Showing {(currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(currentPage * itemsPerPage, productList.length)} of {productList.length} products
                </p>
                <div className="ml-4 flex items-center gap-2">
                  <label htmlFor="products-items-per-page" className="text-[13px] text-[#6B7280] font-medium">
                    Items per page
                  </label>
                  <select
                    id="products-items-per-page"
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
                  <StyledDashboardButton
                    handleClick={() => handlePageClick(Math.max(1, currentPage - 1))}
                    isDisabled={currentPage === 1}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.86 14.3933L7.14003 10.6667C7.01586 10.5418 6.94617 10.3728 6.94617 10.1967C6.94617 10.0205 7.01586 9.85158 7.14003 9.72667L10.86 6.00001C10.9533 5.90599 11.0724 5.84187 11.2022 5.81582C11.3321 5.78977 11.4667 5.80298 11.589 5.85376C11.7113 5.90454 11.8157 5.99058 11.8889 6.10093C11.9621 6.21128 12.0008 6.34092 12 6.47334V13.92C12.0008 14.0524 11.9621 14.1821 11.8889 14.2924C11.8157 14.4028 11.7113 14.4888 11.589 14.5396C11.4667 14.5904 11.3321 14.6036 11.2022 14.5775C11.0724 14.5515 10.9533 14.4874 10.86 14.3933Z"
                        fill="currentColor"
                      />
                    </svg>
                  </StyledDashboardButton>
                  {arr.map((pageNum) => (
                    <StyledDashboardButton
                      key={pageNum}
                      handleClick={() => handlePageClick(pageNum)}
                      isActive={currentPage === pageNum}
                    >
                      {pageNum}
                    </StyledDashboardButton>
                  ))}
                  <StyledDashboardButton
                    handleClick={() => handlePageClick(Math.min(lastPage, currentPage + 1))}
                    isDisabled={currentPage === lastPage}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 11.9193V4.47133C6.00003 4.3395 6.03914 4.21064 6.1124 4.10103C6.18565 3.99142 6.28976 3.906 6.41156 3.85555C6.53336 3.8051 6.66738 3.7919 6.79669 3.81761C6.92599 3.84332 7.04476 3.90679 7.138 4L10.862 7.724C10.987 7.84902 11.0572 8.01856 11.0572 8.19533C11.0572 8.37211 10.987 8.54165 10.862 8.66667L7.138 12.3907C7.04476 12.4839 6.92599 12.5473 6.79669 12.5731C6.66738 12.5988 6.53336 12.5856 6.41156 12.5351C6.28976 12.4847 6.18565 12.3992 6.1124 12.2896C6.03914 12.18 6.00003 12.0512 6 11.9193Z"
                        fill="currentColor"
                      />
                    </svg>
                  </StyledDashboardButton>
                </div>
              </div>
            )}
            </div>
            </div>
          </div>

           

            {/* Pagination / control bar — directly under table body */}
        </>
      )}
    </div>
  );
}
