document.addEventListener("DOMContentLoaded", () => {
  const provinceSelect = document.getElementById("provinceSelect");
  const districtSelect = document.getElementById("districtSelect");

  let products = [];

  const districtData = {
    "อุบลราชธานี": ["เมืองอุบล", "โขงเจียม", "เขมราฐ"],
    "เชียงใหม่": ["สารภี"],
    "ลำพูน": ["ป่าซาง"],
    "หนองคาย": ["เมืองหนองคาย"],
    "ระยอง": ["บ้านค่าย"],
    "เพชรบูรณ์": ["เขาค้อ"],
    "เชียงราย": ["แม่สรวย"],
    "สุรินทร์": ["เมืองสุรินทร์"],
    "สกลนคร": ["พังโคน"],
    "ราชบุรี": ["ดำเนินสะดวก"]
  };

  // fetch JSON จาก GitHub raw URL
  fetch('https://raw.githubusercontent.com/KritsKsn45/lcidata/main/data.json')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then(data => {
      products = data;
      console.log("โหลดข้อมูลสำเร็จ:", products);
      // ถ้าต้องการสามารถเรียกฟังก์ชันแสดงข้อมูลเริ่มต้นที่นี่ได้
    })
    .catch(err => {
      console.error("โหลดข้อมูลสินค้าไม่สำเร็จ:", err);
    });

  provinceSelect.addEventListener("change", () => {
    const selectedProvince = provinceSelect.value;

    districtSelect.innerHTML = '<option value="">เลือกอำเภอ</option>';
    districtSelect.disabled = !selectedProvince;

    if (selectedProvince && districtData[selectedProvince]) {
      districtData[selectedProvince].forEach(d => {
        const opt = document.createElement("option");
        opt.value = d;
        opt.textContent = d;
        districtSelect.appendChild(opt);
      });
    }
  });

  districtSelect.addEventListener("change", () => {
    const selectedProvince = provinceSelect.value;
    const selectedDistrict = districtSelect.value;

    if (!selectedProvince || !selectedDistrict) return;

    document.querySelectorAll(".products-card").forEach(card => {
      const id = parseInt(card.getAttribute("data-id"));
      const product = products.find(p => p.id === id);
      const variant = product?.variants.find(v => v.province === selectedProvince && v.district === selectedDistrict);

      const locationElement = card.querySelector(".product-location");
      const priceElement = card.querySelector(".product-price");

      if (variant) {
        locationElement.textContent = `${variant.district}, ${variant.province}`;
        priceElement.textContent = `${variant.price.toLocaleString()} บาท`;
      } else {
        locationElement.textContent = "ไม่มีข้อมูลพื้นที่นี้";
        priceElement.textContent = "XX บาท";
      }
    });
  });
});
