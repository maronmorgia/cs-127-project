import "../globals.css";

export default function ColorsPage() {
  const colorPalette = [
    {
      title: "Primary",
      colors: [
        { shade: "50", colorName: "--color-primary-50", hex: "#E3F1ED" },
        { shade: "300", colorName: "--color-primary-300", hex: "#6CB398" },
        { shade: "500", colorName: "--color-primary-500", hex: "#499272" },
        { shade: "700", colorName: "--color-primary-700", hex: "#3C755A" },
        { shade: "900", colorName: "--color-primary-900", hex: "#294936" },
      ],
    },
    {
      title: "Secondary",
      colors: [
        { shade: "50", colorName: "--color-secondary-50", hex: "#FBF1E0" },
        { shade: "300", colorName: "--color-secondary-300", hex: "#E7AF4E" },
        { shade: "500", colorName: "--color-secondary-500", hex: "#E08F0E" },
        { shade: "700", colorName: "--color-secondary-700", hex: "#D67506" },
        { shade: "900", colorName: "--color-secondary-900", hex: "#CC5F00" },
      ],
    },
  ];
  return (
    <div className="min-h-dvh bg-dark-gray text-white p-8">
      <h1 className="display2 font-bold mb-6">Colors</h1>
      <div className="space-y-10">
        {colorPalette.map((palette) => (
          <div key={palette.title}>
            <h2>{palette.title}</h2>
            <div className="flex items-start gap-6 mt-4">
              <div className="grid grid-cols-5 gap-4">
                {palette.colors.map((color) => (
                  <div key={color.shade} className="flex flex-col items-center">
                    <div
                      className="w-40 h-18 rounded-lg border border-gray-700"
                      style={{ backgroundColor: `var(${color.colorName})` }}
                    ></div>
                    <div className="w-40 text-center border-t-2 border-white mt-2 pt-2 small text-white">
                      {color.shade} <span className="block subtle text-gray-300">{color.hex}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}