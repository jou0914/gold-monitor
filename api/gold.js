export default async function handler(req, res) {
  try {
    const response = await fetch("https://rate.bot.com.tw/gold?Lang=zh-TW", {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const html = await response.text();

    // 抓價格（抓 100公克 或 1公克）
    const match100g = html.match(/100公克[\s\S]*?(\d{1,3},\d{3})/);
    const match1g = html.match(/1公克[\s\S]*?(\d{1,3},\d{3})/);

    let price = null;

    if (match1g) {
      price = parseFloat(match1g[1].replace(",", ""));
    } else if (match100g) {
      price = parseFloat(match100g[1].replace(",", "")) / 100;
    }

    if (!price) throw new Error("No price found");

    res.status(200).json({
      success: true,
      price
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
