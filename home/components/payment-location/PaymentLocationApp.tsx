"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Filter,
  List,
  MapPinned,
  MapPin,
  Navigation,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import ArcGISMap from "@/components/payment-location/ArcGISMap";
import {
  customerContract,
  fetchMainData,
  getDistanceLabel,
  getItemLat,
  getItemLon,
  getMapIconPath,
  PaymentLocationItem,
  processFilter,
  searchData,
} from "@/lib/payment-location";

type FilterResult = {
  showOffice: boolean;
  showAllAgents: boolean;
  selectedAgents: string[];
  filterLat?: number;
  filterLon?: number;
};

type Coordinates = { lat: number; lon: number };

type ScreenState =
  | { type: "main" }
  | { type: "search"; fromListButton: boolean }
  | { type: "filter" }
  | { type: "detail"; item: PaymentLocationItem };

const DEFAULT_LOCATION: Coordinates = { lat: 13.8505, lon: 100.5575 };
const FILTER_COORDINATES: Array<Coordinates> = [
  { lat: 14.2846, lon: 99.8954 },
  { lat: 13.7687, lon: 99.8171 },
  { lat: 13.7687, lon: 99.8171 },
  { lat: 13.7001, lon: 100.3241 },
  { lat: 13.559, lon: 100.082 },
  { lat: 13.5334, lon: 100.2479 },
  { lat: 13.5334, lon: 100.2479 },
];
const PEA_MOBILE_LABELS: Record<string, string> = {
  M_lotus: "โลตัส",
  M_bigc: "บิ๊กซี",
  M_counterservice: "เคาน์เตอร์เซอร์วิส",
  M_ktb: "ธนาคารกรุงไทย",
  M_kbank: "ธนาคารกสิกรไทย",
  M_tops: "ท็อปส์",
  M_ais: "AIS",
  M_true: "True",
  M_dtac: "DTAC",
  M_central: "เซ็นทรัล",
  M_robinson: "โรบินสัน",
};
const AGENT_KEYS = Object.keys(PEA_MOBILE_LABELS);

function itemKey(item: PaymentLocationItem, index = 0) {
  return String(item.OBJECTID ?? `${item.TYPE ?? "item"}-${item.PEAMOBILE_TYPE ?? "-"}-${item.DISPLAY_NAME ?? index}-${index}`);
}

function applyFilter(items: PaymentLocationItem[], currentFilter: FilterResult | null, selectedFilter: number) {
  let filtered = items;

  if (currentFilter) {
    filtered = filtered.filter((item) => {
      const type = item.TYPE ?? "";
      const mobileType = item.PEAMOBILE_TYPE ?? "";
      if (type === "OFFICE") return currentFilter.showOffice;
      if (type === "AGENT") {
        if (currentFilter.showAllAgents) return true;
        return currentFilter.selectedAgents.includes(mobileType);
      }
      return false;
    });
  }

  if (selectedFilter === 1) {
    filtered = filtered.filter((item) => item.TYPE === "OFFICE");
  } else if (selectedFilter === 2) {
    filtered = filtered.filter((item) => item.TYPE !== "OFFICE");
  }

  return filtered;
}

function buildMapMarkers(items: PaymentLocationItem[]) {
  return items
    .map((item, index) => {
      const lat = getItemLat(item);
      const lon = getItemLon(item);
      if (lat === null || lon === null) return null;
      return {
        id: itemKey(item, index),
        lat,
        lon,
        iconUrl: getMapIconPath(item),
      };
    })
    .filter((value): value is { id: string; lat: number; lon: number; iconUrl: string } => Boolean(value));
}

function openGoogleMaps(item: PaymentLocationItem) {
  const lat = getItemLat(item);
  const lon = getItemLon(item);
  if (lat === null || lon === null) return;
  window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`, "_blank", "noopener,noreferrer");
}

export default function PaymentLocationApp() {
  const router = useRouter();
  const [screen, setScreen] = useState<ScreenState>({ type: "main" });
  const [selectedFilter, setSelectedFilter] = useState(0);
  const [currentFilter, setCurrentFilter] = useState<FilterResult | null>(null);
  const [allData, setAllData] = useState<PaymentLocationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [userLocation, setUserLocation] = useState<Coordinates>(DEFAULT_LOCATION);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lon: number; zoom?: number }>({
    ...DEFAULT_LOCATION,
    zoom: 13,
  });
  const [filterLocation, setFilterLocation] = useState<Coordinates | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const displayList = useMemo(
    () => applyFilter(allData, currentFilter, selectedFilter),
    [allData, currentFilter, selectedFilter],
  );

  const selectedMarkerId = screen.type === "detail" ? itemKey(screen.item) : null;

  useEffect(() => {
    if (!navigator.geolocation) {
      loadData(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const next = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        setUserLocation(next);
        setMapCenter({ ...next, zoom: 13 });
        loadData(next.lat, next.lon);
      },
      () => {
        loadData(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData(lat = userLocation.lat, lon = userLocation.lon) {
    setIsLoading(true);
    setFeedback(null);
    const items = await fetchMainData(lat, lon);
    setAllData(items);
    setIsLoading(false);
    if (items.length === 0) {
      setFeedback("ไม่สามารถโหลดข้อมูลแผนที่ได้ในขณะนี้");
    }
  }

  function goBack() {
    if (screen.type === "main") return;
    setScreen({ type: "main" });
  }

  function onFilterChipClick(index: number) {
    if (index === 99) {
      setScreen({ type: "filter" });
      return;
    }
    setSelectedFilter(index);
  }

  function onCurrentLocationClick() {
    setMapCenter({ ...userLocation, zoom: 15 });
  }

  async function onFilterApply(result: FilterResult) {
    setCurrentFilter(result);
    setSelectedFilter(0);
    setScreen({ type: "main" });

    if (typeof result.filterLat === "number" && typeof result.filterLon === "number") {
      const target = { lat: result.filterLat, lon: result.filterLon };
      setFilterLocation(target);
      setMapCenter({ ...target, zoom: 15 });
      await loadData(target.lat, target.lon);
      return;
    }

    setFilterLocation(null);
    setMapCenter({ ...userLocation, zoom: 13 });
    await loadData(userLocation.lat, userLocation.lon);
  }

  async function onOpenDetail(item: PaymentLocationItem) {
    const lat = getItemLat(item);
    const lon = getItemLon(item);
    if (lat !== null && lon !== null) {
      setMapCenter({ lat, lon, zoom: 16 });
    }
    setScreen({ type: "detail", item });
  }

  const mapMarkers = buildMapMarkers(screen.type === "detail" ? [screen.item] : displayList);

  return (
    <div className="payment-location-shell flex h-full flex-col bg-white">
      {screen.type === "main" && (
        <>
          <div className="relative flex-1 overflow-hidden bg-white">
            <div className="absolute inset-0 pb-[90px] pt-[110px]">
              <ArcGISMap
                center={mapCenter}
                markers={mapMarkers}
                userLocation={userLocation}
                filterLocation={filterLocation}
                selectedMarkerId={selectedMarkerId}
                onMarkerClick={(markerId) => {
                  const found = displayList.find((item, index) => itemKey(item, index) === markerId);
                  if (found) {
                    void onOpenDetail(found);
                  }
                }}
              />
            </div>

            <div className="absolute inset-x-0 top-0 z-20 bg-white/95 backdrop-blur">
              <div className="flex items-center gap-2 px-4 pb-3 pt-4">
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700"
                  aria-label="ย้อนกลับ"
                >
                  <ArrowLeft size={20} />
                </button>
                <h1 className="text-lg font-semibold text-slate-900">สาขาและช่องทางให้บริการ</h1>
              </div>

              <div className="px-3">
                <button
                  type="button"
                  onClick={() => setScreen({ type: "search", fromListButton: false })}
                  className="flex h-11 w-full items-center gap-3 rounded-full bg-slate-200 px-4 text-left text-sm text-slate-500"
                >
                  <Search size={18} className="text-slate-500" />
                  ค้นหาสาขา, ที่อยู่
                </button>
              </div>

              <div className="no-scrollbar overflow-x-auto px-3 py-2">
                <div className="flex w-max items-center gap-2">
                  <FilterChip
                    selected={false}
                    onClick={() => onFilterChipClick(99)}
                    icon={<SlidersHorizontal size={14} />}
                    label="ตัวกรอง"
                  />
                  <FilterChip selected={selectedFilter === 0} onClick={() => onFilterChipClick(0)} label="ทั้งหมด" />
                  <FilterChip
                    selected={selectedFilter === 1}
                    onClick={() => onFilterChipClick(1)}
                    label="สำนักงานการไฟฟ้า"
                  />
                  <FilterChip
                    selected={selectedFilter === 2}
                    onClick={() => onFilterChipClick(2)}
                    label="ตัวแทนรับชำระเงิน"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onCurrentLocationClick}
              className={`absolute right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg ${
                isExpanded ? "bottom-[calc(40vh+1rem)]" : "bottom-[106px]"
              }`}
              aria-label="ตำแหน่งปัจจุบัน"
            >
              <MapPin size={20} className="text-fuchsia-800" />
            </button>

            <div className="absolute inset-x-0 bottom-0 z-20 rounded-t-[28px] bg-white shadow-[0_-6px_18px_rgba(15,23,42,0.12)]">
              <div className="pt-3">
                <div className="mx-auto h-1.5 w-10 rounded-full bg-slate-300" />
              </div>
              <div className="flex items-center justify-between px-5 py-3">
                <p className="text-xs font-semibold text-slate-500">
                  รายชื่อ ทั้งหมด <span className="text-fuchsia-800">{displayList.length}</span> รายการ
                </p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setScreen({ type: "search", fromListButton: true })}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-fuchsia-800"
                    aria-label="ดูเป็นรายการ"
                  >
                    <List size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsExpanded((value) => !value)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500"
                    aria-label={isExpanded ? "ย่อ" : "ขยาย"}
                  >
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                  </button>
                </div>
              </div>
              {isExpanded && <div className="h-px bg-slate-100" />}
              <div className={`${isExpanded ? "h-[40vh]" : "h-[90px]"} transition-all duration-200`}>
                {isExpanded && (
                  <div className="h-full overflow-y-auto px-4 pb-5 pt-2">
                    {isLoading ? (
                      <div className="flex h-full items-center justify-center text-sm text-slate-500">กำลังโหลดข้อมูล...</div>
                    ) : displayList.length === 0 ? (
                      <EmptyMainState message={feedback ?? "ไม่พบข้อมูลจุดให้บริการ"} />
                    ) : (
                      <div className="space-y-3">
                        {displayList.map((item, index) => (
                          <ServiceListCard
                            key={itemKey(item, index)}
                            item={item}
                            onMore={() => void onOpenDetail(item)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {screen.type === "search" && (
        <SearchOverlay
          allData={allData}
          initialItems={screen.fromListButton ? displayList : []}
          fromListButton={screen.fromListButton}
          userLocation={userLocation}
          onClose={goBack}
          onOpenDetail={(item) => void onOpenDetail(item)}
        />
      )}

      {screen.type === "filter" && (
        <FilterOverlay
          currentFilter={currentFilter}
          onApply={onFilterApply}
          onClose={goBack}
        />
      )}

      {screen.type === "detail" && (
        <DetailOverlay item={screen.item} onBack={goBack} onOpenGoogleMaps={() => openGoogleMaps(screen.item)} />
      )}
    </div>
  );
}

function FilterChip({
  selected,
  onClick,
  label,
  icon,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm ${
        selected ? "bg-fuchsia-800 text-white" : "bg-white text-slate-600"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function ServiceListCard({
  item,
  onMore,
}: {
  item: PaymentLocationItem;
  onMore: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 px-4 py-3">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100">
          <PaymentLocationIcon item={item} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">{item.DISPLAY_NAME ?? "-"}</p>
          <p className="mt-1 text-xs text-slate-600">{item.ADDRESS ?? "-"}</p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-xs font-semibold text-fuchsia-800">{getDistanceLabel(item)}</p>
            <button
              type="button"
              onClick={onMore}
              className="inline-flex items-center gap-1 rounded-full border border-fuchsia-200 px-3 py-1.5 text-[11px] font-semibold text-fuchsia-800"
            >
              ดูเพิ่มเติม
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


function getFallbackIconPath(primaryPath: string): string {
  if (primaryPath.startsWith('/asset/')) return primaryPath.replace('/asset/', '/assets/');
  if (primaryPath.startsWith('/assets/')) return primaryPath.replace('/assets/', '/asset/');
  return primaryPath;
}

function PaymentLocationIcon({ item }: { item: PaymentLocationItem }) {
  const primaryPath = getMapIconPath(item);
  const fallbackPath = getFallbackIconPath(primaryPath);

  return (
    <img
      src={primaryPath}
      alt="icon"
      className="h-7 w-7 object-contain"
      onError={(event) => {
        const target = event.currentTarget;
        if (target.dataset.fallbackApplied === 'true') return;
        target.dataset.fallbackApplied = 'true';
        target.src = fallbackPath;
      }}
    />
  );
}

function EmptyMainState({ message }: { message: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-slate-500">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-50">
        <MapPinned size={34} className="text-slate-300" />
      </div>
      <p className="text-sm font-medium text-slate-700">{message}</p>
    </div>
  );
}

function SearchOverlay({
  allData,
  initialItems,
  fromListButton,
  userLocation,
  onClose,
  onOpenDetail,
}: {
  allData: PaymentLocationItem[];
  initialItems: PaymentLocationItem[];
  fromListButton: boolean;
  userLocation: Coordinates;
  onClose: () => void;
  onOpenDetail: (item: PaymentLocationItem) => void;
}) {
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(0);
  const [hasSearched, setHasSearched] = useState(fromListButton);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<PaymentLocationItem[]>(initialItems);

  useEffect(() => {
    if (!hasSearched) return;

    if (!searchText.trim()) {
      setResults(initialItems.length > 0 ? initialItems : allData);
      setIsSearching(false);
      return;
    }

    const timer = window.setTimeout(async () => {
      setIsSearching(true);
      const remote = await searchData(searchText, userLocation.lat, userLocation.lon);
      const fallback = allData.filter((item) => {
        const name = String(item.DISPLAY_NAME ?? "").toLowerCase();
        const address = String(item.ADDRESS ?? "").toLowerCase();
        return name.includes(searchText.toLowerCase()) || address.includes(searchText.toLowerCase());
      });
      setResults(remote.length > 0 ? remote : fallback);
      setIsSearching(false);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [allData, hasSearched, initialItems, searchText, userLocation.lat, userLocation.lon]);

  const filteredResults = useMemo(() => {
    if (selectedFilter === 1) return results.filter((item) => item.TYPE === "OFFICE");
    if (selectedFilter === 2) return results.filter((item) => item.TYPE !== "OFFICE");
    return results;
  }, [results, selectedFilter]);

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b border-slate-100 bg-white px-4 pb-3 pt-4">
        <div className="flex items-center gap-2">
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700">
            <ArrowLeft size={20} />
          </button>
          <div className="flex h-11 flex-1 items-center rounded-full border border-fuchsia-400 bg-white px-3">
            <Search size={18} className="text-slate-400" />
            <input
              value={searchText}
              autoFocus={!fromListButton}
              onChange={(event) => {
                setSearchText(event.target.value);
                setHasSearched(true);
              }}
              placeholder="ค้นหาสาขา, ที่อยู่"
              className="ml-2 h-full flex-1 border-0 bg-transparent text-sm outline-none"
            />
            {searchText ? (
              <button
                type="button"
                onClick={() => {
                  setSearchText("");
                  setResults(allData);
                  setHasSearched(true);
                }}
                className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400"
              >
                <X size={16} />
              </button>
            ) : null}
          </div>
        </div>

        <div className="no-scrollbar overflow-x-auto pt-3">
          <div className="flex w-max items-center gap-2">
            <FilterChip selected={selectedFilter === 0} onClick={() => setSelectedFilter(0)} label="ทั้งหมด" />
            <FilterChip selected={selectedFilter === 1} onClick={() => setSelectedFilter(1)} label="สำนักงานการไฟฟ้า" />
            <FilterChip selected={selectedFilter === 2} onClick={() => setSelectedFilter(2)} label="ตัวแทนรับชำระเงิน" />
          </div>
        </div>
      </div>

      {hasSearched && (
        <div className="px-4 py-3 text-xs text-slate-500">
          รายการค้นหา ทั้งหมด <span className="font-semibold text-fuchsia-800">{filteredResults.length}</span> จุดบริการ
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {!hasSearched ? null : isSearching ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">กำลังค้นหา...</div>
        ) : filteredResults.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-8 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-50">
              <Search size={38} className="text-slate-300" />
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-800">ขออภัยไม่พบจุดให้บริการที่ตรงกับคำที่คุณต้องการค้นหา</p>
            <p className="mt-2 text-xs text-slate-500">กรุณาตรวจสอบตัวสะกดให้ถูกต้อง หรือลองค้นหาใหม่อีกครั้ง</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredResults.map((item, index) => (
              <div key={itemKey(item, index)} className="flex gap-3 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-100">
                  <PaymentLocationIcon item={item} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{item.DISPLAY_NAME ?? "-"}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">{item.ADDRESS ?? "-"}</p>
                  <p className="mt-2 text-xs font-medium text-slate-600">{getDistanceLabel(item)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenDetail(item)}
                  className="self-start text-sm font-medium text-fuchsia-800"
                >
                  ดูเพิ่มเติม
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DetailOverlay({
  item,
  onBack,
  onOpenGoogleMaps,
}: {
  item: PaymentLocationItem;
  onBack: () => void;
  onOpenGoogleMaps: () => void;
}) {
  const lat = getItemLat(item) ?? DEFAULT_LOCATION.lat;
  const lon = getItemLon(item) ?? DEFAULT_LOCATION.lon;

  return (
    <div className="relative flex h-full flex-col bg-white">
      <div className="absolute inset-0 pb-[40vh] pt-[72px]">
        <ArcGISMap
          center={{ lat, lon, zoom: 16 }}
          markers={buildMapMarkers([item])}
          selectedMarkerId={itemKey(item)}
        />
      </div>

      <div className="absolute inset-x-0 top-0 z-20 bg-white/95 px-4 pb-3 pt-4 backdrop-blur">
        <div className="flex items-center gap-2">
          <button type="button" onClick={onBack} className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold text-slate-900">สาขาและช่องทางให้บริการ</h1>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 h-[40vh] rounded-t-[28px] bg-white px-5 pb-5 pt-3 shadow-[0_-6px_18px_rgba(15,23,42,0.12)]">
        <div className="mx-auto h-1.5 w-10 rounded-full bg-slate-300" />
        <div className="mt-4 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100">
            <PaymentLocationIcon item={item} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-bold text-slate-900">{item.DISPLAY_NAME ?? "-"}</p>
          </div>
          <button type="button" onClick={onBack} className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400">
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 h-px bg-slate-100" />

        <div className="mt-4 space-y-3 overflow-y-auto pb-2 text-sm text-slate-700">
          <DetailRow label="บริการ:" value={item.SERVICE ?? "-"} />
          <DetailRow label="ที่อยู่:" value={item.ADDRESS ?? "-"} />
          <DetailRow label="เวลาทำการ:" value={item.OFFICE_HOURS ?? "-"} />
          <DetailRow label="ติดต่อ:" value={item.TELEPHONE ?? "-"} />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-900">{getDistanceLabel(item)}</p>
          <button
            type="button"
            onClick={onOpenGoogleMaps}
            className="inline-flex items-center gap-2 rounded-full border border-fuchsia-200 px-4 py-2 text-sm font-semibold text-fuchsia-800"
          >
            ขอเส้นทาง
            <Navigation size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-sm leading-6">
      <span className="w-[74px] shrink-0 font-medium text-slate-500">{label}</span>
      <span className="text-slate-800">{value}</span>
    </div>
  );
}

function FilterOverlay({
  currentFilter,
  onApply,
  onClose,
}: {
  currentFilter: FilterResult | null;
  onApply: (result: FilterResult) => void | Promise<void>;
  onClose: () => void;
}) {
  const [showOffice, setShowOffice] = useState(currentFilter?.showOffice ?? true);
  const [showAllAgents, setShowAllAgents] = useState(currentFilter?.showAllAgents ?? true);
  const [selectedCA, setSelectedCA] = useState<string | null>(null);
  const [selectedCAName, setSelectedCAName] = useState<string | null>(null);
  const [selectedCAIndex, setSelectedCAIndex] = useState<number | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [isCABottomSheetOpen, setIsCABottomSheetOpen] = useState(false);
  const [caItems, setCaItems] = useState<Array<{ ca?: string; customerName?: string; customerAddress?: string }>>([]);
  const [agentToggles, setAgentToggles] = useState<Record<string, boolean>>(() => {
    const base = Object.fromEntries(AGENT_KEYS.map((key) => [key, true])) as Record<string, boolean>;
    if (!currentFilter) return base;
    return Object.fromEntries(
      AGENT_KEYS.map((key) => [key, currentFilter.showAllAgents || currentFilter.selectedAgents.includes(key)]),
    ) as Record<string, boolean>;
  });

  function clearFilter() {
    setShowOffice(true);
    setShowAllAgents(true);
    setSelectedCA(null);
    setSelectedCAName(null);
    setSelectedCAIndex(null);
    setAgentToggles(Object.fromEntries(AGENT_KEYS.map((key) => [key, true])) as Record<string, boolean>);
  }

  async function openCABottomSheet() {
    const items = await customerContract();
    setCaItems(items);
    setIsCABottomSheetOpen(true);
  }

  async function applyFilterResult() {
    setIsApplying(true);
    let filterLat: number | undefined;
    let filterLon: number | undefined;

    if (selectedCA) {
      const result = await processFilter(selectedCA);
      if (result?.lat !== undefined && result.lon !== undefined) {
        filterLat = result.lat;
        filterLon = result.lon;
      } else if (selectedCAIndex !== null && FILTER_COORDINATES[selectedCAIndex]) {
        filterLat = FILTER_COORDINATES[selectedCAIndex].lat;
        filterLon = FILTER_COORDINATES[selectedCAIndex].lon;
      }
    }

    const selectedAgents = Object.entries(agentToggles)
      .filter(([, enabled]) => enabled)
      .map(([key]) => key);

    await onApply({
      showOffice,
      showAllAgents,
      selectedAgents,
      filterLat,
      filterLon,
    });
    setIsApplying(false);
  }

  return (
    <div className="relative flex h-full flex-col bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 pb-3 pt-4">
        <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold text-slate-900">ตัวกรอง</h1>
        <div className="w-9" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        <SectionCard title="ประเภทจุดให้บริการ">
          <ToggleRow label="สำนักงานการไฟฟ้า" checked={showOffice} onChange={setShowOffice} />
          <ToggleRow
            label="ตัวแทนรับชำระเงินทั้งหมด"
            checked={showAllAgents}
            onChange={(value) => {
              setShowAllAgents(value);
              setAgentToggles(Object.fromEntries(AGENT_KEYS.map((key) => [key, value])) as Record<string, boolean>);
            }}
          />
        </SectionCard>

        <SectionCard title="ตัวแทนรับชำระเงิน">
          <div className="space-y-3">
            {AGENT_KEYS.map((key) => (
              <ToggleRow
                key={key}
                label={PEA_MOBILE_LABELS[key]}
                checked={agentToggles[key]}
                onChange={(value) => {
                  const next = { ...agentToggles, [key]: value };
                  setAgentToggles(next);
                  setShowAllAgents(Object.values(next).every(Boolean));
                }}
              />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="ระบุสถานที่ใช้ไฟฟ้า">
          <button
            type="button"
            onClick={() => void openCABottomSheet()}
            className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left"
          >
            <span className={selectedCAName ? "text-sm text-slate-900" : "text-sm text-slate-400"}>
              {selectedCAName ?? "สถานที่ใช้ไฟฟ้า"}
            </span>
            <ChevronDown size={18} className="text-slate-400" />
          </button>
        </SectionCard>
      </div>

      <div className="border-t border-slate-100 px-5 pb-6 pt-4">
        <button
          type="button"
          onClick={() => void applyFilterResult()}
          disabled={isApplying}
          className="w-full rounded-xl bg-fuchsia-800 px-4 py-3 text-sm font-semibold text-white disabled:opacity-70"
        >
          {isApplying ? "กำลังประมวลผล..." : "ยืนยัน"}
        </button>
        <button type="button" onClick={clearFilter} className="mt-3 w-full text-sm text-slate-500">
          ล้างตัวกรอง
        </button>
      </div>

      {isCABottomSheetOpen && (
        <div className="absolute inset-0 z-30 flex items-end bg-black/40">
          <div className="w-full rounded-t-[28px] bg-white px-4 pb-5 pt-3">
            <div className="mx-auto h-1.5 w-10 rounded-full bg-slate-300" />
            <div className="relative py-4 text-center">
              <p className="text-base font-semibold text-slate-900">สถานที่ใช้ไฟฟ้า</p>
              <button
                type="button"
                onClick={() => setIsCABottomSheetOpen(false)}
                className="absolute right-0 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400"
              >
                <X size={18} />
              </button>
            </div>
            <div className="h-px bg-slate-100" />

            {caItems.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm font-semibold text-slate-800">คุณยังไม่มีการเพิ่มสถานที่ใช้ไฟฟ้า</p>
                <p className="mt-2 text-xs text-slate-500">
                  เริ่มต้นเพิ่มสถานที่ใช้ไฟฟ้าของคุณ เพื่อความสะดวกในการจ่ายบิล และบริการอื่นๆ บน PEA Smart Plus
                </p>
                <button
                  type="button"
                  className="mt-5 rounded-full border border-fuchsia-700 px-4 py-2 text-sm font-medium text-fuchsia-700"
                >
                  เพิ่มสถานที่ใช้ไฟฟ้า
                </button>
              </div>
            ) : (
              <div className="max-h-[60vh] overflow-y-auto py-1">
                {caItems.map((item, index) => (
                  <button
                    key={`${item.ca ?? "ca"}-${index}`}
                    type="button"
                    onClick={() => {
                      setSelectedCA(item.ca ?? null);
                      setSelectedCAName(item.customerName ?? item.ca ?? null);
                      setSelectedCAIndex(index);
                      setIsCABottomSheetOpen(false);
                    }}
                    className="flex w-full items-start justify-between gap-3 border-b border-slate-100 px-1 py-4 text-left last:border-b-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">{item.customerName ?? "-"}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.customerAddress ?? "-"}</p>
                    </div>
                    <ChevronRight size={18} className="mt-0.5 shrink-0 text-slate-300" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-5 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
      <h2 className="mb-4 text-sm font-semibold text-slate-900">{title}</h2>
      {children}
    </section>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 py-2">
      <span className="text-sm text-slate-700">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 rounded-full transition ${checked ? "bg-fuchsia-800" : "bg-slate-300"}`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition ${checked ? "left-[22px]" : "left-0.5"}`}
        />
      </button>
    </label>
  );
}
