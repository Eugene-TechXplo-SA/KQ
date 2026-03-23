import { useEffect, useMemo, useState } from "react";
import {
  btnBase,
  btnGhost,
  fieldLabel,
  inputBase,
  panelBase,
  panelBody,
  panelHeader,
  thBase,
} from "../ui/styles";

const initialState = {
  settings: {
    defaultAsset: "KQ",
    rewardRate: 30,
    withdrawalNetwork: "Polygon",
  },
  brokers: [
    {
      id: "B001",
      code: "EXNESS",
      name: "Exness",
      displayName: "Exness",
      csvFormat: "EXNESS",
      rewardRate: 30,
      ibCurrency: "USD",
      maintenance: false,
    },
    {
      id: "B002",
      code: "FXGT",
      name: "FX GT",
      displayName: "FX GT",
      csvFormat: "FXGT",
      rewardRate: 30,
      ibCurrency: "USD",
      maintenance: false,
    },
    {
      id: "B003",
      code: "XM",
      name: "XM Trading",
      displayName: "XM Trading",
      csvFormat: "XM",
      rewardRate: 30,
      ibCurrency: "USD",
      maintenance: false,
    },
  ],
  distributionRatios: [
    { asset: "KQ", ratio: 25 },
    { asset: "BTC", ratio: 8 },
    { asset: "ETH", ratio: 8 },
    { asset: "USDT", ratio: 15 },
    { asset: "USDC", ratio: 10 },
    { asset: "XRP", ratio: 7 },
    { asset: "JPYR", ratio: 12 },
    { asset: "JPYC", ratio: 10 },
    { asset: "IZAKAYA", ratio: 5 },
  ],
  ranks: {
    GOLD: { name: "Gold", multi: 2.0, threshold: 50000 },
    SILVER: { name: "Silver", multi: 1.5, threshold: 10000 },
    MEMBER: { name: "Member", multi: 1.0, threshold: 0 },
  },
  campaigns: [
    {
      id: "CMP001",
      name: "春キャンペーン",
      type: "PERIOD",
      multiplier: 1.5,
      startDate: "2026-03-01",
      endDate: "2026-03-31",
      status: "ACTIVE",
    },
    {
      id: "CMP002",
      name: "入会1ヶ月キャンペーン",
      type: "PER_USER",
      multiplier: 1.3,
      durationDays: 30,
      status: "ACTIVE",
    },
    {
      id: "CMP003",
      name: "GOLD会員限定ボーナス",
      type: "PER_USER",
      multiplier: 2.0,
      durationDays: 0,
      status: "INACTIVE",
    },
  ],
  referenceRates: {
    KQ: 120,
    BTC: 15000000,
    ETH: 600000,
    USDT: 155,
    USDC: 155,
    XRP: 80,
    JPYR: 1,
    JPYC: 1,
    IZAKAYA: 50,
  },
  emergencyStop: {
    csvImport: true,
    reward: false,
    withdrawal: false,
    accountLinking: false,
  },
};

function deepCopy(data) {
  return JSON.parse(JSON.stringify(data));
}

const COPY = {
  ja: {
    lang: "言語",
    ja: "日本語",
    en: "英語",
    invalidInput: "入力不正",
    saved: "保存しました",
    updatedRule: "ルール設定を更新しました",
    resetDone: "リセットしました",
    resetMockDone: "モック設定を初期値に戻しました",
    rewardRateRange: "還元率は0〜100で入力してください",
    brokerCodeNameRequired: "コードと名称は必須です",
    duplicateError: "重複エラー",
    codeAlreadyExists: "コード {{code}} は既に存在します",
    added: "追加しました",
    registeredCode: "{{code}} を登録しました",
    updated: "更新しました",
    updatedCode: "{{code}} を更新しました",
    needAtLeastOneAsset: "アセットが1つ以上必要です",
    emptyAssetName: "空のアセット名があります",
    ratioNot100: "合計100%ではありません",
    currentTotal: "現在の合計: {{total}}%",
    ratioUpdated: "配分比率を更新しました",
    rankUpdated: "ランクマスターを更新しました",
    campaignNameRequired: "名称は必須です",
    campaignMultiplierMin: "倍率は1以上で入力してください",
    campaignCreated: "{{name}} を作成しました",
    campaignUpdated: "{{name}} を更新しました",
    rateUpdated: "参考レートを更新しました",
    ruleTitle: "ルール設定",
    ruleSub: "付与アセット・出金ネットワークの設定",
    save: "保存",
    reset: "Reset",
    defaultAsset: "デフォルト付与アセット",
    rewardRate: "還元率 (%)",
    withdrawalNetwork: "出金ネットワーク",
    brokerTitle: "提携FX業者と設定値",
    brokerSub: "ブローカーごとのパラメータ管理",
    add: "追加",
    code: "コード",
    name: "名称",
    displayName: "表示名",
    csvFormat: "CSV形式",
    ibCurrency: "IB通貨",
    status: "ステータス",
    action: "操作",
    operating: "稼働",
    maintenance: "メンテ中",
    edit: "編集",
    noBroker: "業者が登録されていません",
    distributionTitle: "配分比率（DST-01）",
    distributionSub: "アセット間の配分比率（合計100%）",
    addAsset: "アセット追加",
    remove: "削除",
    total: "合計",
    totalNot100: "合計100%ではありません",
    rankTitle: "ランクマスター（RNK-01）",
    rankSub: "ランク定義・還元率倍率・昇格条件",
    multiplier: "倍率",
    threshold: "昇格閾値 LEV_USD",
    campaignTitle: "キャンペーン管理（CMP-01）",
    campaignSub: "キャンペーン倍率（期間限定/個別）の管理",
    newCreate: "新規作成",
    period: "期間限定",
    perUser: "個別",
    days: "日",
    rateTitle: "参考レート（PRC-01）",
    rateSub: "各アセットの参考レート（付与量計算に使用）",
    emergencyTitle: "緊急停止スイッチ（OPS-01）",
    emergencySub: "異常時に即時停止/再開",
    stopCsv: "CSV取込 停止",
    stopReward: "付与処理 停止",
    stopWithdrawal: "出金処理 停止",
    stopLinking: "口座連携 停止",
    notice: "注意",
    noticeBody:
      "本番では、設定変更は監査ログ（誰がいつ何を変更したか）を必ず残す。",
    brokerAdd: "業者を追加",
    brokerEdit: "業者を編集",
    campaignAdd: "キャンペーン追加",
    campaignEdit: "キャンペーン編集",
    cancel: "キャンセル",
    maintenanceMode: "メンテナンス中",
    type: "タイプ",
    startDate: "開始日",
    endDate: "終了日",
    durationDays: "適用日数",
    active: "ACTIVE",
    inactive: "INACTIVE",
    asOfStatus: "ステータス",
  },
  en: {
    lang: "Language",
    ja: "Japanese",
    en: "English",
    invalidInput: "Invalid input",
    saved: "Saved",
    updatedRule: "Rule settings updated",
    resetDone: "Reset done",
    resetMockDone: "Mock settings restored",
    rewardRateRange: "Reward rate must be between 0 and 100",
    brokerCodeNameRequired: "Broker code and name are required",
    duplicateError: "Duplicate error",
    codeAlreadyExists: "Code {{code}} already exists",
    added: "Added",
    registeredCode: "Registered {{code}}",
    updated: "Updated",
    updatedCode: "Updated {{code}}",
    needAtLeastOneAsset: "At least one asset is required",
    emptyAssetName: "There is an empty asset name",
    ratioNot100: "Total ratio is not 100%",
    currentTotal: "Current total: {{total}}%",
    ratioUpdated: "Distribution ratios updated",
    rankUpdated: "Rank master updated",
    campaignNameRequired: "Campaign name is required",
    campaignMultiplierMin: "Multiplier must be 1 or greater",
    campaignCreated: "Created {{name}}",
    campaignUpdated: "Updated {{name}}",
    rateUpdated: "Reference rates updated",
    ruleTitle: "Rule Settings",
    ruleSub: "Default reward asset and withdrawal network",
    save: "Save",
    reset: "Reset",
    defaultAsset: "Default Reward Asset",
    rewardRate: "Reward Rate (%)",
    withdrawalNetwork: "Withdrawal Network",
    brokerTitle: "Partner Brokers and Parameters",
    brokerSub: "Broker-level parameter management",
    add: "Add",
    code: "Code",
    name: "Name",
    displayName: "Display Name",
    csvFormat: "CSV Format",
    ibCurrency: "IB Currency",
    status: "Status",
    action: "Action",
    operating: "Active",
    maintenance: "Maintenance",
    edit: "Edit",
    noBroker: "No brokers registered",
    distributionTitle: "Distribution Ratios (DST-01)",
    distributionSub: "Cross-asset ratio allocation (must total 100%)",
    addAsset: "Add Asset",
    remove: "Remove",
    total: "Total",
    totalNot100: "Total is not 100%",
    rankTitle: "Rank Master (RNK-01)",
    rankSub: "Rank definitions, multipliers, and thresholds",
    multiplier: "Multiplier",
    threshold: "Promotion Threshold LEV_USD",
    campaignTitle: "Campaign Management (CMP-01)",
    campaignSub: "Campaign multiplier management",
    newCreate: "Create New",
    period: "Period",
    perUser: "Per User",
    days: "days",
    rateTitle: "Reference Rates (PRC-01)",
    rateSub: "Reference rates used for reward calculation",
    emergencyTitle: "Emergency Stops (OPS-01)",
    emergencySub: "Immediate stop/resume controls",
    stopCsv: "Stop CSV import",
    stopReward: "Stop reward processing",
    stopWithdrawal: "Stop withdrawal processing",
    stopLinking: "Stop account linking",
    notice: "Notice",
    noticeBody:
      "In production, always keep an audit log of who changed what and when.",
    brokerAdd: "Add Broker",
    brokerEdit: "Edit Broker",
    campaignAdd: "Add Campaign",
    campaignEdit: "Edit Campaign",
    cancel: "Cancel",
    maintenanceMode: "In maintenance",
    type: "Type",
    startDate: "Start Date",
    endDate: "End Date",
    durationDays: "Duration Days",
    active: "ACTIVE",
    inactive: "INACTIVE",
    asOfStatus: "Status",
  },
};

export default function SettingsView({ isActive }) {
  const [formState, setFormState] = useState(() => deepCopy(initialState));
  const [locale, setLocale] = useState(() => {
    if (typeof window === "undefined") return "ja";
    try {
      return localStorage.getItem("kq_admin_locale") || "ja";
    } catch {
      return "ja";
    }
  });
  const [toast, setToast] = useState(null);
  const [brokerModal, setBrokerModal] = useState({
    open: false,
    mode: "create",
    id: "",
    code: "",
    name: "",
    displayName: "",
    csvFormat: "BIGBOSS",
    rewardRate: 30,
    ibCurrency: "USD",
    maintenance: false,
  });
  const [campaignModal, setCampaignModal] = useState({
    open: false,
    mode: "create",
    id: "",
    name: "",
    type: "PERIOD",
    multiplier: 1.5,
    startDate: "",
    endDate: "",
    durationDays: 30,
    status: "ACTIVE",
  });

  const ratioTotal = useMemo(
    () =>
      formState.distributionRatios.reduce(
        (sum, row) => sum + (Number(row.ratio) || 0),
        0,
      ),
    [formState.distributionRatios],
  );

  const t = COPY[locale] || COPY.ja;
  const text = (key, vars = {}) => {
    const base = t[key] || COPY.ja[key] || key;
    return Object.entries(vars).reduce(
      (acc, [k, v]) => acc.replaceAll(`{{${k}}}`, String(v)),
      base,
    );
  };

  const changeLocale = (next) => {
    setLocale(next);
    try {
      localStorage.setItem("kq_admin_locale", next);
    } catch {
      // local storage may be unavailable
    }
  };

  const showToast = (type, title, message = "") => {
    const id = Date.now() + Math.random();
    setToast({ id, type, title, message });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 2800);
  };

  const saveSettings = () => {
    const rate = Number(formState.settings.rewardRate);
    if (!Number.isFinite(rate) || rate < 0 || rate > 100) {
      showToast("err", text("invalidInput"), text("rewardRateRange"));
      return;
    }
    showToast("ok", text("saved"), text("updatedRule"));
  };

  const resetMock = () => {
    setFormState(deepCopy(initialState));
    showToast("ok", text("resetDone"), text("resetMockDone"));
  };

  const openBrokerCreate = () => {
    setBrokerModal({
      open: true,
      mode: "create",
      id: "",
      code: "",
      name: "",
      displayName: "",
      csvFormat: "BIGBOSS",
      rewardRate: 30,
      ibCurrency: "USD",
      maintenance: false,
    });
  };

  const openBrokerEdit = (broker) => {
    setBrokerModal({
      open: true,
      mode: "edit",
      id: broker.id,
      code: broker.code,
      name: broker.name,
      displayName: broker.displayName,
      csvFormat: broker.csvFormat,
      rewardRate: broker.rewardRate,
      ibCurrency: broker.ibCurrency,
      maintenance: broker.maintenance,
    });
  };

  const saveBroker = () => {
    const code = brokerModal.code.trim().toUpperCase();
    const name = brokerModal.name.trim();
    const rewardRate = Number(brokerModal.rewardRate);
    if (!code || !name) {
      showToast("err", text("invalidInput"), text("brokerCodeNameRequired"));
      return;
    }
    if (!Number.isFinite(rewardRate) || rewardRate < 0 || rewardRate > 100) {
      showToast("err", text("invalidInput"), text("rewardRateRange"));
      return;
    }

    if (brokerModal.mode === "create") {
      const duplicate = formState.brokers.some((b) => b.code === code);
      if (duplicate) {
        showToast(
          "err",
          text("duplicateError"),
          text("codeAlreadyExists", { code }),
        );
        return;
      }
      const next = {
        id: `B${String(formState.brokers.length + 1).padStart(3, "0")}`,
        code,
        name,
        displayName: brokerModal.displayName.trim() || name,
        csvFormat: brokerModal.csvFormat.trim() || "BIGBOSS",
        rewardRate,
        ibCurrency: brokerModal.ibCurrency.trim() || "USD",
        maintenance: !!brokerModal.maintenance,
      };
      setFormState((prev) => ({ ...prev, brokers: [...prev.brokers, next] }));
      showToast("ok", text("added"), text("registeredCode", { code }));
    } else {
      setFormState((prev) => ({
        ...prev,
        brokers: prev.brokers.map((b) =>
          b.id === brokerModal.id
            ? {
                ...b,
                code,
                name,
                displayName: brokerModal.displayName.trim() || name,
                csvFormat: brokerModal.csvFormat.trim() || "BIGBOSS",
                rewardRate,
                ibCurrency: brokerModal.ibCurrency.trim() || "USD",
                maintenance: !!brokerModal.maintenance,
              }
            : b,
        ),
      }));
      showToast("ok", text("updated"), text("updatedCode", { code }));
    }

    setBrokerModal((prev) => ({ ...prev, open: false }));
  };

  const addDistributionAsset = () => {
    setFormState((prev) => ({
      ...prev,
      distributionRatios: [...prev.distributionRatios, { asset: "", ratio: 0 }],
    }));
  };

  const updateDistribution = (index, key, value) => {
    setFormState((prev) => ({
      ...prev,
      distributionRatios: prev.distributionRatios.map((row, idx) =>
        idx === index ? { ...row, [key]: value } : row,
      ),
    }));
  };

  const removeDistributionAsset = (index) => {
    setFormState((prev) => ({
      ...prev,
      distributionRatios: prev.distributionRatios.filter(
        (_, idx) => idx !== index,
      ),
    }));
  };

  const saveDistributionRatios = () => {
    if (formState.distributionRatios.length === 0) {
      showToast("err", text("invalidInput"), text("needAtLeastOneAsset"));
      return;
    }
    const hasEmpty = formState.distributionRatios.some(
      (r) => !String(r.asset || "").trim(),
    );
    if (hasEmpty) {
      showToast("err", text("invalidInput"), text("emptyAssetName"));
      return;
    }
    if (ratioTotal !== 100) {
      showToast(
        "err",
        text("ratioNot100"),
        text("currentTotal", { total: ratioTotal }),
      );
      return;
    }
    setFormState((prev) => ({
      ...prev,
      distributionRatios: prev.distributionRatios.map((r) => ({
        asset: String(r.asset).trim().toUpperCase(),
        ratio: Number(r.ratio) || 0,
      })),
    }));
    showToast("ok", text("saved"), text("ratioUpdated"));
  };

  const updateRank = (rankKey, field, value) => {
    setFormState((prev) => ({
      ...prev,
      ranks: {
        ...prev.ranks,
        [rankKey]: {
          ...prev.ranks[rankKey],
          [field]: value,
        },
      },
    }));
  };

  const saveRankMaster = () => {
    showToast("ok", text("saved"), text("rankUpdated"));
  };

  const openCampaignCreate = () => {
    setCampaignModal({
      open: true,
      mode: "create",
      id: "",
      name: "",
      type: "PERIOD",
      multiplier: 1.5,
      startDate: "",
      endDate: "",
      durationDays: 30,
      status: "ACTIVE",
    });
  };

  const openCampaignEdit = (campaign) => {
    setCampaignModal({
      open: true,
      mode: "edit",
      id: campaign.id,
      name: campaign.name,
      type: campaign.type,
      multiplier: campaign.multiplier,
      startDate: campaign.startDate || "",
      endDate: campaign.endDate || "",
      durationDays: campaign.durationDays ?? 30,
      status: campaign.status || "ACTIVE",
    });
  };

  const saveCampaign = () => {
    const name = campaignModal.name.trim();
    const multiplier = Number(campaignModal.multiplier);
    if (!name) {
      showToast("err", text("invalidInput"), text("campaignNameRequired"));
      return;
    }
    if (!Number.isFinite(multiplier) || multiplier < 1) {
      showToast("err", text("invalidInput"), text("campaignMultiplierMin"));
      return;
    }

    if (campaignModal.mode === "create") {
      const next = {
        id: `CMP${String(formState.campaigns.length + 1).padStart(3, "0")}`,
        name,
        type: campaignModal.type,
        multiplier,
        startDate: campaignModal.startDate || null,
        endDate: campaignModal.endDate || null,
        durationDays: Number(campaignModal.durationDays) || 0,
        status: campaignModal.status,
      };
      setFormState((prev) => ({
        ...prev,
        campaigns: [...prev.campaigns, next],
      }));
      showToast("ok", text("added"), text("campaignCreated", { name }));
    } else {
      setFormState((prev) => ({
        ...prev,
        campaigns: prev.campaigns.map((c) =>
          c.id === campaignModal.id
            ? {
                ...c,
                name,
                type: campaignModal.type,
                multiplier,
                startDate: campaignModal.startDate || null,
                endDate: campaignModal.endDate || null,
                durationDays: Number(campaignModal.durationDays) || 0,
                status: campaignModal.status,
              }
            : c,
        ),
      }));
      showToast("ok", text("updated"), text("campaignUpdated", { name }));
    }

    setCampaignModal((prev) => ({ ...prev, open: false }));
  };

  const updateReferenceRate = (asset, value) => {
    setFormState((prev) => ({
      ...prev,
      referenceRates: {
        ...prev.referenceRates,
        [asset]: value,
      },
    }));
  };

  const saveReferenceRates = () => {
    showToast("ok", text("saved"), text("rateUpdated"));
  };

  const toggleEmergency = (key) => {
    setFormState((prev) => ({
      ...prev,
      emergencyStop: {
        ...prev.emergencyStop,
        [key]: !prev.emergencyStop[key],
      },
    }));
  };

  const campaignTypeLabel = (type) =>
    type === "PERIOD" ? text("period") : text("perUser");

  return (
    <section
      className={`view ${isActive ? "" : "is-hidden"} [&.is-hidden]:hidden`}
      id="view-settings"
    >
      <div className={`${panelBase} mb-3.5`}>
        <div className={panelHeader}>
          <div>
            <div className="panel-title font-black">{text("ruleTitle")}</div>
            <div className="panel-sub mt-1 text-[0.92rem] text-gray-500">
              {text("ruleSub")}
            </div>
          </div>
          <div className="actions flex flex-wrap gap-2">
            <button
              className={`${btnBase} text-sm`}
              onClick={saveSettings}
              type="button"
            >
              <span className="material-icons text-[18px]" aria-hidden="true">
                save
              </span>
              {text("save")}
            </button>
            <button
              className={`${btnGhost} rounded-[10px] px-3 py-2.5 text-sm font-bold`}
              onClick={resetMock}
              type="button"
            >
              <span className="material-icons text-[18px]" aria-hidden="true">
                restart_alt
              </span>
              {text("reset")}
            </button>
            <div className="flex items-center gap-2 rounded-[10px] border border-gray-300 bg-white px-2 py-1.5">
              <span className="text-xs font-semibold text-gray-500">
                {text("lang")}
              </span>
              <select
                value={locale}
                onChange={(event) => changeLocale(event.target.value)}
                className="bg-transparent text-xs font-semibold text-gray-700 outline-none"
              >
                <option value="ja">{text("ja")}</option>
                <option value="en">{text("en")}</option>
              </select>
            </div>
          </div>
        </div>
        <div className={panelBody}>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="field">
              <label className={`${fieldLabel} mb-1.5 block`}>
                {text("defaultAsset")}
              </label>
              <select
                id="setAsset"
                value={formState.settings.defaultAsset}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    settings: {
                      ...prev.settings,
                      defaultAsset: event.target.value,
                    },
                  }))
                }
                className={`${inputBase} h-10 w-full text-sm`}
              >
                <option value="KQ">KQ</option>
                <option value="USDT">USDT</option>
                <option value="JPYR">JPYR</option>
              </select>
            </div>
            <div className="field">
              <label className={`${fieldLabel} mb-1.5 block`}>
                {text("rewardRate")}
              </label>
              <input
                id="setRewardRate"
                type="number"
                min="0"
                max="100"
                step="1"
                value={formState.settings.rewardRate}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    settings: {
                      ...prev.settings,
                      rewardRate: Number(event.target.value || 0),
                    },
                  }))
                }
                className={`${inputBase} h-10 w-full text-sm`}
              />
            </div>
            <div className="field">
              <label className={`${fieldLabel} mb-1.5 block`}>
                {text("withdrawalNetwork")}
              </label>
              <input
                value={formState.settings.withdrawalNetwork}
                disabled
                className={`${inputBase} h-10 w-full cursor-not-allowed bg-gray-100 text-sm text-gray-500`}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={`${panelBase} mb-3.5`}>
        <div className={panelHeader}>
          <div>
            <div className="panel-title font-black">{text("brokerTitle")}</div>
            <div className="panel-sub mt-1 text-[0.92rem] text-gray-500">
              {text("brokerSub")}
            </div>
          </div>
          <div className="actions">
            <button
              className={`${btnGhost} rounded-[10px] px-3 py-2.5 text-sm font-bold`}
              onClick={openBrokerCreate}
              type="button"
            >
              <span className="material-icons text-[18px]" aria-hidden="true">
                add
              </span>
              {text("add")}
            </button>
          </div>
        </div>
        <div className={panelBody}>
          <div className="table-wrap overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table
                className="table w-full min-w-[980px] border-separate border-spacing-0 text-[0.9rem]"
                id="tblBrokers"
              >
                <thead>
                  <tr>
                    <th className={thBase}>{text("code")}</th>
                    <th className={thBase}>{text("name")}</th>
                    <th className={thBase}>{text("displayName")}</th>
                    <th className={thBase}>{text("csvFormat")}</th>
                    <th className={thBase}>{text("rewardRate")}</th>
                    <th className={thBase}>{text("ibCurrency")}</th>
                    <th className={thBase}>{text("status")}</th>
                    <th className={`${thBase} right text-right`}>
                      {text("action")}
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:hover]:bg-gray-50 [&_td]:border-b [&_td]:border-gray-200">
                  {formState.brokers.map((broker) => (
                    <tr key={broker.id}>
                      <td className="px-3 py-3 font-semibold text-gray-700">
                        {broker.code}
                      </td>
                      <td className="px-3 py-3 text-gray-700">{broker.name}</td>
                      <td className="px-3 py-3 text-gray-700">
                        {broker.displayName}
                      </td>
                      <td className="px-3 py-3">
                        <span className="rounded-full bg-gray-200 px-2.5 py-1 text-[0.72rem] font-bold text-gray-700">
                          {broker.csvFormat}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right font-semibold text-gray-700">
                        {broker.rewardRate}%
                      </td>
                      <td className="px-3 py-3 text-gray-700">
                        {broker.ibCurrency}
                      </td>
                      <td className="px-3 py-3">
                        {broker.maintenance ? (
                          <span className="rounded-full bg-red-100 px-2.5 py-1 text-[0.72rem] font-bold text-red-700">
                            {text("maintenance")}
                          </span>
                        ) : (
                          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[0.72rem] font-bold text-emerald-700">
                            {text("operating")}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <button
                          className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-1.5 text-[0.74rem] font-semibold text-gray-600 hover:bg-gray-100"
                          type="button"
                          onClick={() => openBrokerEdit(broker)}
                        >
                          {text("edit")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div
              className="empty p-[18px] text-center text-gray-500"
              id="emptyBrokers"
              hidden={formState.brokers.length !== 0}
            >
              {text("noBroker")}
            </div>
          </div>
        </div>
      </div>

      <div className={`${panelBase} mb-3.5`}>
        <div className={panelHeader}>
          <div>
            <div className="panel-title font-black">
              {text("distributionTitle")}
            </div>
            <div className="panel-sub mt-1 text-[0.92rem] text-gray-500">
              {text("distributionSub")}
            </div>
          </div>
          <div className="actions flex flex-wrap gap-2">
            <button
              className={`${btnGhost} rounded-[10px] px-3 py-2.5 text-sm font-bold`}
              onClick={addDistributionAsset}
              type="button"
            >
              <span className="material-icons text-[18px]" aria-hidden="true">
                add
              </span>
              {text("addAsset")}
            </button>
            <button
              className={`${btnBase} text-sm`}
              onClick={saveDistributionRatios}
              type="button"
            >
              <span className="material-icons text-[18px]" aria-hidden="true">
                save
              </span>
              {text("save")}
            </button>
          </div>
        </div>
        <div className={panelBody}>
          <div id="distributionRatiosList" className="space-y-2">
            {formState.distributionRatios.map((row, index) => (
              <div
                key={`${row.asset}-${index}`}
                className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
              >
                <input
                  type="text"
                  value={row.asset}
                  onChange={(event) =>
                    updateDistribution(
                      index,
                      "asset",
                      event.target.value.toUpperCase(),
                    )
                  }
                  className="h-9 w-[110px] rounded-lg border border-gray-300 bg-white px-2 text-sm font-bold text-gray-700 outline-none"
                  placeholder="ASSET"
                />
                <input
                  type="number"
                  value={row.ratio}
                  min="0"
                  max="100"
                  step="1"
                  onChange={(event) =>
                    updateDistribution(
                      index,
                      "ratio",
                      Number(event.target.value || 0),
                    )
                  }
                  className="h-9 w-[90px] rounded-lg border border-gray-300 bg-white px-2 text-right text-sm font-bold text-gray-700 outline-none"
                />
                <span className="text-sm font-semibold text-gray-500">%</span>
                <button
                  className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                  type="button"
                  onClick={() => removeDistributionAsset(index)}
                >
                  {text("remove")}
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm font-bold text-gray-700">
            <span>
              {text("total")}: {ratioTotal}%
            </span>
            {ratioTotal === 100 ? (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[0.72rem] text-emerald-700">
                OK
              </span>
            ) : (
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-[0.72rem] text-red-700">
                {text("totalNot100")}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={`${panelBase} mb-3.5`}>
        <div className={panelHeader}>
          <div>
            <div className="panel-title font-black">{text("rankTitle")}</div>
            <div className="panel-sub mt-1 text-[0.92rem] text-gray-500">
              {text("rankSub")}
            </div>
          </div>
          <div className="actions">
            <button
              className={`${btnBase} text-sm`}
              onClick={saveRankMaster}
              type="button"
            >
              <span className="material-icons text-[18px]" aria-hidden="true">
                save
              </span>
              {text("save")}
            </button>
          </div>
        </div>
        <div className={panelBody}>
          <div id="rankMasterList" className="space-y-2">
            {Object.entries(formState.ranks).map(([key, rank]) => (
              <div
                key={key}
                className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
              >
                <span className="w-[90px] rounded-full bg-gray-200 px-2 py-1 text-center text-[0.74rem] font-bold text-gray-700">
                  {rank.name}
                </span>
                <span className="text-sm text-gray-500">
                  {text("multiplier")}
                </span>
                <input
                  type="number"
                  value={rank.multi}
                  min="0.1"
                  step="0.1"
                  onChange={(event) =>
                    updateRank(key, "multi", Number(event.target.value || 0))
                  }
                  className="h-9 w-[80px] rounded-lg border border-gray-300 bg-white px-2 text-right text-sm font-bold text-gray-700 outline-none"
                />
                <span className="text-sm text-gray-500">
                  {text("threshold")}
                </span>
                <input
                  type="number"
                  value={rank.threshold}
                  min="0"
                  step="1000"
                  onChange={(event) =>
                    updateRank(
                      key,
                      "threshold",
                      Number(event.target.value || 0),
                    )
                  }
                  className="h-9 w-[120px] rounded-lg border border-gray-300 bg-white px-2 text-right text-sm font-bold text-gray-700 outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`${panelBase} mb-3.5`}>
        <div className={panelHeader}>
          <div>
            <div className="panel-title font-black">
              {text("campaignTitle")}
            </div>
            <div className="panel-sub mt-1 text-[0.92rem] text-gray-500">
              {text("campaignSub")}
            </div>
          </div>
          <div className="actions">
            <button
              className={`${btnGhost} rounded-[10px] px-3 py-2.5 text-sm font-bold`}
              onClick={openCampaignCreate}
              type="button"
            >
              <span className="material-icons text-[18px]" aria-hidden="true">
                add
              </span>
              {text("newCreate")}
            </button>
          </div>
        </div>
        <div className={panelBody}>
          <div id="campaignMasterList" className="space-y-2">
            {formState.campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5"
              >
                <div>
                  <div className="font-semibold text-gray-700">
                    {campaign.name}
                  </div>
                  <div className="text-[0.82rem] text-gray-500">
                    {campaignTypeLabel(campaign.type)} / x{campaign.multiplier}
                    {campaign.type === "PERIOD"
                      ? ` / ${campaign.startDate || "-"} ~ ${campaign.endDate || "-"}`
                      : ` / ${campaign.durationDays ?? 0}${text("days")}`}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[0.72rem] font-bold ${campaign.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-700"}`}
                  >
                    {campaign.status === "ACTIVE"
                      ? text("active")
                      : text("inactive")}
                  </span>
                  <button
                    className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-1.5 text-[0.74rem] font-semibold text-gray-600 hover:bg-gray-100"
                    type="button"
                    onClick={() => openCampaignEdit(campaign)}
                  >
                    {text("edit")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`${panelBase} mb-3.5`}>
        <div className={panelHeader}>
          <div>
            <div className="panel-title font-black">{text("rateTitle")}</div>
            <div className="panel-sub mt-1 text-[0.92rem] text-gray-500">
              {text("rateSub")}
            </div>
          </div>
          <div className="actions">
            <button
              className={`${btnBase} text-sm`}
              onClick={saveReferenceRates}
              type="button"
            >
              <span className="material-icons text-[18px]" aria-hidden="true">
                save
              </span>
              {text("save")}
            </button>
          </div>
        </div>
        <div className={panelBody}>
          <div
            id="referenceRatesList"
            className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3"
          >
            {Object.entries(formState.referenceRates).map(([asset, value]) => (
              <div
                key={asset}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2"
              >
                <span className="w-[70px] rounded-full bg-gray-200 px-2 py-1 text-center text-[0.74rem] font-bold text-gray-700">
                  {asset}
                </span>
                <span className="text-sm font-bold text-gray-500">¥</span>
                <input
                  type="number"
                  value={value}
                  min="0"
                  step="any"
                  onChange={(event) =>
                    updateReferenceRate(asset, Number(event.target.value || 0))
                  }
                  className="h-9 flex-1 rounded-lg border border-gray-300 bg-white px-2 text-right text-sm font-bold text-gray-700 outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`${panelBase} mb-3.5`}>
        <div className={panelHeader}>
          <div>
            <div className="panel-title font-black">
              {text("emergencyTitle")}
            </div>
            <div className="panel-sub mt-1 text-[0.92rem] text-gray-500">
              {text("emergencySub")}
            </div>
          </div>
        </div>
        <div className={panelBody}>
          <div id="emergencyStopStatus" className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={formState.emergencyStop.csvImport}
                onChange={() => toggleEmergency("csvImport")}
              />
              {text("stopCsv")}
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={formState.emergencyStop.reward}
                onChange={() => toggleEmergency("reward")}
              />
              {text("stopReward")}
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={formState.emergencyStop.withdrawal}
                onChange={() => toggleEmergency("withdrawal")}
              />
              {text("stopWithdrawal")}
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={formState.emergencyStop.accountLinking}
                onChange={() => toggleEmergency("accountLinking")}
              />
              {text("stopLinking")}
            </label>
          </div>
        </div>
      </div>

      <div className="notice subtle flex gap-2.5 rounded-2xl border border-gray-200 bg-gray-50 p-3">
        <span className="material-icons text-[20px]" aria-hidden="true">
          shield
        </span>
        <div>
          <div className="font-black text-gray-700">{text("notice")}</div>
          <div className="mt-0.5 text-[0.84rem] leading-relaxed text-gray-500">
            {text("noticeBody")}
          </div>
        </div>
      </div>

      {brokerModal.open && (
        <div className="fixed inset-0 z-30 grid place-items-center bg-black/55 p-[18px]">
          <div className="w-full max-w-[700px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_10px_15px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between border-b border-gray-200 px-3.5 py-3">
              <div className="font-black">
                {brokerModal.mode === "create"
                  ? text("brokerAdd")
                  : text("brokerEdit")}
              </div>
              <button
                className="text-gray-600"
                onClick={() =>
                  setBrokerModal((prev) => ({ ...prev, open: false }))
                }
                type="button"
              >
                <span className="material-icons">close</span>
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 p-3.5 md:grid-cols-2">
              <div>
                <label className={`${fieldLabel} mb-1.5 block`}>
                  {text("code")}
                </label>
                <input
                  className={`${inputBase} h-10 w-full text-sm`}
                  value={brokerModal.code}
                  onChange={(e) =>
                    setBrokerModal((p) => ({ ...p, code: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className={`${fieldLabel} mb-1.5 block`}>
                  {text("name")}
                </label>
                <input
                  className={`${inputBase} h-10 w-full text-sm`}
                  value={brokerModal.name}
                  onChange={(e) =>
                    setBrokerModal((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className={`${fieldLabel} mb-1.5 block`}>
                  {text("displayName")}
                </label>
                <input
                  className={`${inputBase} h-10 w-full text-sm`}
                  value={brokerModal.displayName}
                  onChange={(e) =>
                    setBrokerModal((p) => ({
                      ...p,
                      displayName: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className={`${fieldLabel} mb-1.5 block`}>
                  {text("csvFormat")}
                </label>
                <input
                  className={`${inputBase} h-10 w-full text-sm`}
                  value={brokerModal.csvFormat}
                  onChange={(e) =>
                    setBrokerModal((p) => ({ ...p, csvFormat: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className={`${fieldLabel} mb-1.5 block`}>
                  {text("rewardRate")}
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className={`${inputBase} h-10 w-full text-sm`}
                  value={brokerModal.rewardRate}
                  onChange={(e) =>
                    setBrokerModal((p) => ({
                      ...p,
                      rewardRate: Number(e.target.value || 0),
                    }))
                  }
                />
              </div>
              <div>
                <label className={`${fieldLabel} mb-1.5 block`}>
                  {text("ibCurrency")}
                </label>
                <input
                  className={`${inputBase} h-10 w-full text-sm`}
                  value={brokerModal.ibCurrency}
                  onChange={(e) =>
                    setBrokerModal((p) => ({
                      ...p,
                      ibCurrency: e.target.value,
                    }))
                  }
                />
              </div>
              <label className="md:col-span-2 flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={brokerModal.maintenance}
                  onChange={(e) =>
                    setBrokerModal((p) => ({
                      ...p,
                      maintenance: e.target.checked,
                    }))
                  }
                />
                {text("maintenanceMode")}
              </label>
            </div>
            <div className="flex justify-end gap-2 border-t border-gray-200 px-3.5 py-3">
              <button
                className={`${btnGhost} rounded-[10px] px-3 py-2 text-sm font-bold`}
                onClick={() =>
                  setBrokerModal((prev) => ({ ...prev, open: false }))
                }
                type="button"
              >
                {text("cancel")}
              </button>
              <button
                className={`${btnBase} text-sm`}
                onClick={saveBroker}
                type="button"
              >
                {text("save")}
              </button>
            </div>
          </div>
        </div>
      )}

      {campaignModal.open && (
        <div className="fixed inset-0 z-30 grid place-items-center bg-black/55 p-[18px]">
          <div className="w-full max-w-[700px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_10px_15px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between border-b border-gray-200 px-3.5 py-3">
              <div className="font-black">
                {campaignModal.mode === "create"
                  ? text("campaignAdd")
                  : text("campaignEdit")}
              </div>
              <button
                className="text-gray-600"
                onClick={() =>
                  setCampaignModal((prev) => ({ ...prev, open: false }))
                }
                type="button"
              >
                <span className="material-icons">close</span>
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 p-3.5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className={`${fieldLabel} mb-1.5 block`}>
                  {text("name")}
                </label>
                <input
                  className={`${inputBase} h-10 w-full text-sm`}
                  value={campaignModal.name}
                  onChange={(e) =>
                    setCampaignModal((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className={`${fieldLabel} mb-1.5 block`}>
                  {text("type")}
                </label>
                <select
                  className={`${inputBase} h-10 w-full text-sm`}
                  value={campaignModal.type}
                  onChange={(e) =>
                    setCampaignModal((p) => ({ ...p, type: e.target.value }))
                  }
                >
                  <option value="PERIOD">{text("period")}</option>
                  <option value="PER_USER">{text("perUser")}</option>
                </select>
              </div>
              <div>
                <label className={`${fieldLabel} mb-1.5 block`}>
                  {text("multiplier")}
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.1"
                  className={`${inputBase} h-10 w-full text-sm`}
                  value={campaignModal.multiplier}
                  onChange={(e) =>
                    setCampaignModal((p) => ({
                      ...p,
                      multiplier: Number(e.target.value || 1),
                    }))
                  }
                />
              </div>
              {campaignModal.type === "PERIOD" ? (
                <>
                  <div>
                    <label className={`${fieldLabel} mb-1.5 block`}>
                      {text("startDate")}
                    </label>
                    <input
                      type="date"
                      className={`${inputBase} h-10 w-full text-sm`}
                      value={campaignModal.startDate || ""}
                      onChange={(e) =>
                        setCampaignModal((p) => ({
                          ...p,
                          startDate: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className={`${fieldLabel} mb-1.5 block`}>
                      {text("endDate")}
                    </label>
                    <input
                      type="date"
                      className={`${inputBase} h-10 w-full text-sm`}
                      value={campaignModal.endDate || ""}
                      onChange={(e) =>
                        setCampaignModal((p) => ({
                          ...p,
                          endDate: e.target.value,
                        }))
                      }
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className={`${fieldLabel} mb-1.5 block`}>
                    {text("durationDays")}
                  </label>
                  <input
                    type="number"
                    min="0"
                    className={`${inputBase} h-10 w-full text-sm`}
                    value={campaignModal.durationDays}
                    onChange={(e) =>
                      setCampaignModal((p) => ({
                        ...p,
                        durationDays: Number(e.target.value || 0),
                      }))
                    }
                  />
                </div>
              )}
              <div>
                <label className={`${fieldLabel} mb-1.5 block`}>
                  {text("asOfStatus")}
                </label>
                <select
                  className={`${inputBase} h-10 w-full text-sm`}
                  value={campaignModal.status}
                  onChange={(e) =>
                    setCampaignModal((p) => ({ ...p, status: e.target.value }))
                  }
                >
                  <option value="ACTIVE">{text("active")}</option>
                  <option value="INACTIVE">{text("inactive")}</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-gray-200 px-3.5 py-3">
              <button
                className={`${btnGhost} rounded-[10px] px-3 py-2 text-sm font-bold`}
                onClick={() =>
                  setCampaignModal((prev) => ({ ...prev, open: false }))
                }
                type="button"
              >
                {text("cancel")}
              </button>
              <button
                className={`${btnBase} text-sm`}
                onClick={saveCampaign}
                type="button"
              >
                {text("save")}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-4 right-4 z-50">
          <div
            className={`rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg ${toast.type === "ok" ? "bg-emerald-600" : toast.type === "warn" ? "bg-yellow-600" : "bg-red-600"}`}
          >
            <div>{toast.title}</div>
            {toast.message && (
              <div className="text-xs opacity-90">{toast.message}</div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
