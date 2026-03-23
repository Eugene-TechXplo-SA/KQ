export default function DashboardView({ isActive }) {
  const userCountData = [10, 10.5, 10.8, 11, 11.2, 11.5, 11.8, 12, 12];
  const tokenAllocationData = [
    3000, 2500, 4000, 3500, 5000, 8500, 8000, 4500, 3000,
  ];
  const rateData = [118, 117, 116, 115, 114, 115, 116, 117, 115, 114, 113, 112];

  const maxUserCount = 12;
  const maxTokenAllocation = 10000;
  const minRate = 112;
  const maxRate = 118;
  const rateRange = maxRate - minRate;

  return (
    <section
      className={`view ${isActive ? "" : "is-hidden"} [&.is-hidden]:hidden`}
      id="view-dashboard"
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <div className="text-[0.92rem] font-semibold text-gray-500">
            未承認の口座申請
          </div>
          <div className="mt-2 text-[2.2rem] font-black text-gray-800">2</div>
          <div className="mt-1 text-[0.88rem] text-gray-500">
            件のアクションが必要
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <div className="text-[0.92rem] font-semibold text-gray-500">
            未処理の出金申請
          </div>
          <div className="mt-2 text-[2.2rem] font-black text-gray-800">3</div>
          <div className="mt-1 text-[0.88rem] text-gray-500">
            件のアクションが必要
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <div className="text-[0.92rem] font-semibold text-gray-500">
            有効ユーザー数
          </div>
          <div className="mt-2 text-[2.2rem] font-black text-gray-800">12</div>
          <div className="mt-1 text-[0.88rem] text-gray-500">
            ウォレット接続済み
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <div className="text-[0.92rem] font-semibold text-gray-500">
            KQ トークンレート
          </div>
          <div className="mt-2 text-[2.2rem] font-black text-gray-800">
            ¥114.28
          </div>
          <div className="mt-1 text-[0.88rem] text-red-600">
            -0.91 | 11:30:44
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 gap-3.5 xl:grid-cols-3">
        {/* User Count Chart */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <div className="mb-4">
            <div className="text-base font-black text-gray-700">
              ユーザー数（推移）
            </div>
            <div className="mt-1 text-[0.82rem] text-gray-500">
              日別の累計ユーザー数
            </div>
          </div>
          <svg
            className="w-full"
            viewBox="0 0 320 180"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Background grid */}
            <rect width="320" height="180" fill="#FEF2F2" />
            <defs>
              <linearGradient
                id="userGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "#D62828", stopOpacity: 0.3 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#D62828", stopOpacity: 0 }}
                />
              </linearGradient>
            </defs>

            {/* Draw area under line */}
            <polyline
              points={userCountData
                .map((val, idx) => {
                  const x = (idx / (userCountData.length - 1)) * 300 + 10;
                  const y = 160 - (val / maxUserCount) * 140;
                  return `${x},${y}`;
                })
                .join(" ")}
              fill="none"
              stroke="#D62828"
              strokeWidth="2"
            />

            {/* Draw filled area */}
            <polygon
              points={`10,160 ${userCountData
                .map((val, idx) => {
                  const x = (idx / (userCountData.length - 1)) * 300 + 10;
                  const y = 160 - (val / maxUserCount) * 140;
                  return `${x},${y}`;
                })
                .join(" ")} 310,160`}
              fill="url(#userGradient)"
            />

            {/* Y axis labels */}
            <text x="5" y="165" fontSize="10" fill="#999">
              0
            </text>
            <text x="5" y="95" fontSize="10" fill="#999">
              6
            </text>
            <text x="5" y="25" fontSize="10" fill="#999">
              12
            </text>

            {/* X axis labels */}
            {[
              "02/08",
              "02/12",
              "02/16",
              "02/20",
              "02/24",
              "02/28",
              "03/04",
              "03/08",
            ].map((label, idx) => (
              <text
                key={label}
                x={15 + idx * 37.5}
                y="175"
                fontSize="9"
                fill="#999"
                textAnchor="middle"
              >
                {label}
              </text>
            ))}
          </svg>
        </div>

        {/* Token Allocation Chart */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <div className="mb-4">
            <div className="text-base font-black text-gray-700">
              KQトークン付与総数（推移）
            </div>
            <div className="mt-1 text-[0.82rem] text-gray-500">
              日別のKQトークン付与量
            </div>
          </div>
          <svg
            className="w-full"
            viewBox="0 0 320 180"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Background */}
            <rect width="320" height="180" fill="#F3F4F6" />

            {/* Draw bars */}
            {tokenAllocationData.map((val, idx) => {
              const barWidth = 28;
              const barHeight = (val / maxTokenAllocation) * 140;
              const x = 10 + idx * 35;
              const y = 160 - barHeight;
              return (
                <g key={idx}>
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill="#D62828"
                  />
                </g>
              );
            })}

            {/* Y axis labels */}
            <text x="5" y="165" fontSize="10" fill="#999">
              0
            </text>
            <text x="0" y="105" fontSize="10" fill="#999">
              5,000
            </text>
            <text x="0" y="25" fontSize="10" fill="#999">
              10,000
            </text>

            {/* X axis labels */}
            {[
              "02/16",
              "02/18",
              "02/20",
              "02/22",
              "02/24",
              "02/26",
              "02/28",
              "03/02",
              "03/08",
            ].map((label, idx) => (
              <text
                key={label}
                x={24 + idx * 31}
                y="175"
                fontSize="9"
                fill="#999"
                textAnchor="middle"
              >
                {label}
              </text>
            ))}
          </svg>
        </div>

        {/* Rate Trend Chart */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <div className="mb-4">
            <div className="text-base font-black text-gray-700">
              KQトークンレート（推移）
            </div>
            <div className="mt-1 text-[0.82rem] text-gray-500">
              直近のレート変動
            </div>
          </div>
          <svg
            className="w-full"
            viewBox="0 0 320 180"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Background grid */}
            <rect width="320" height="180" fill="#FAFAFA" />

            {/* Draw line */}
            <polyline
              points={rateData
                .map((val, idx) => {
                  const x = (idx / (rateData.length - 1)) * 300 + 10;
                  const y = 160 - ((val - minRate) / rateRange) * 140;
                  return `${x},${y}`;
                })
                .join(" ")}
              fill="none"
              stroke="#D62828"
              strokeWidth="2"
            />

            {/* Y axis labels */}
            <text x="315" y="165" fontSize="10" fill="#999">
              ¥112
            </text>
            <text x="315" y="95" fontSize="10" fill="#999">
              ¥115
            </text>
            <text x="315" y="25" fontSize="10" fill="#999">
              ¥118
            </text>

            {/* Horizontal grid lines */}
            <line
              x1="10"
              y1="160"
              x2="310"
              y2="160"
              stroke="#E5E7EB"
              strokeWidth="1"
            />
            <line
              x1="10"
              y1="95"
              x2="310"
              y2="95"
              stroke="#E5E7EB"
              strokeWidth="1"
              strokeDasharray="2"
            />
            <line
              x1="10"
              y1="30"
              x2="310"
              y2="30"
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
