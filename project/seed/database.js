// project/seed/seed.js
require("dotenv").config();
const mongoose = require("mongoose");
const { Types } = mongoose;

const Product = require("../models/product.model");
const User = require("../models/user.model");
const Review = require("../models/review.model");

const { hashPassword } = require("../utils/hashing");
const connectDB = require("../utils/db");

/**
 * CONFIG
 */
const TOTAL_USERS = 50; // gồm cả admin
const TOTAL_PRODUCTS = 30;
const MIN_REVIEWS_PER_PRODUCT = 30;
const MAX_REVIEWS_PER_PRODUCT = 40;

/**
 * ===== TẠO ID CỐ ĐỊNH =====
 */
const adminId = new Types.ObjectId();

// 49 user thường (vì 1 admin = tổng 50)
const normalUserIds = Array.from({ length: TOTAL_USERS - 1 }, () => new Types.ObjectId());

// 30 sản phẩm
const productIds = Array.from({ length: TOTAL_PRODUCTS }, () => new Types.ObjectId());

/**
 * ===== USERS =====
 */
async function buildUsers() {
  const adminPwd = await hashPassword("admin123");

  const users = [
    {
      _id: adminId,
      username: "admin",
      email: "admin@gmail.com",
      passwordHash: adminPwd,
      role: "admin",
    },
  ];

  // 49 users thường
  for (let i = 0; i < TOTAL_USERS - 1; i++) {
    users.push({
      _id: normalUserIds[i],
      username: `user${i + 1}`,
      email: `user${i + 1}@gmail.com`,
      passwordHash: await hashPassword("user123"),
      role: "user",
    });
  }

  return users;
}

/**
 * ===== PRODUCTS (30 items) =====
 * Dùng 30 link đầu tiên bạn gửi (bỏ link Garmin cuối để đủ 30 sản phẩm)
 */
const productCatalog = [
  {
    name: "LG QNED 55 inch 4K Smart TV QNED80TSA",
    category: "tv",
    price: 12990,
    image:
      "https://cdn2.fptshop.com.vn/unsafe/150x0/filters:format(webp):quality(75)/lg_55qned80tsa_1_6bd4710424.png",
    description:
      "Smart TV LG QNED 55 inch độ phân giải 4K, màu sắc rực rỡ nhờ công nghệ QNED kết hợp dải màu rộng. Hỗ trợ các chế độ hình ảnh tối ưu theo nội dung, âm thanh sống động cho phim và thể thao. Phù hợp phòng khách vừa và lớn, tối ưu trải nghiệm giải trí gia đình với hệ điều hành thông minh và kết nối đa dạng.",
  },
  {
    name: "iPhone 13 mini 128GB (Midnight)",
    category: "phone",
    price: 10990,
    image:
      "https://cdn2.fptshop.com.vn/unsafe/150x0/filters:format(webp):quality(75)/2021_9_15_637673230231791121_iphone-13-mini-den-1.jpg",
    description:
      "iPhone 13 mini nhỏ gọn, cầm một tay thoải mái nhưng vẫn mạnh mẽ nhờ chip A15 Bionic. Màn hình OLED sắc nét, camera chụp đêm tốt, quay video ổn định. Lựa chọn phù hợp cho người thích điện thoại gọn nhẹ nhưng vẫn cần hiệu năng cao và độ mượt khi dùng lâu dài.",
  },
  {
    name: "MacBook Air 13 M2 (Midnight)",
    category: "laptop",
    price: 24990,
    image:
      "https://cdn2.fptshop.com.vn/unsafe/150x0/filters:format(webp):quality(75)/macbook_air_13_m2_midnight_1_35053fbcf9.png",
    description:
      "MacBook Air 13 sử dụng chip Apple M2 cho hiệu năng mượt, tiết kiệm pin, vận hành êm ái. Thiết kế mỏng nhẹ, màn hình sắc nét, phù hợp học tập – văn phòng – sáng tạo nội dung cơ bản. Bàn phím thoải mái, trackpad rộng và độ ổn định cao khi dùng lâu.",
  },
  {
    name: "HP 14s (Ryzen) - Laptop văn phòng gọn nhẹ",
    category: "laptop",
    price: 11990,
    image:
      "https://cdn2.fptshop.com.vn/unsafe/150x0/filters:format(webp):quality(75)/2023_4_11_638168318097684459_hp-14s-em0080au-r3-7320u-bac-dd.jpg",
    description:
      "Laptop HP 14s hướng đến nhu cầu học tập và làm việc hằng ngày: gọn nhẹ, dễ mang theo, hiệu năng ổn định cho Office, trình duyệt và học online. Thiết kế thanh lịch, màn hình đủ dùng, phù hợp người cần máy bền bỉ và dễ sử dụng.",
  },
  {
    name: "ASUS Gaming VivoBook K3605 (Black)",
    category: "laptop",
    price: 18990,
    image:
      "https://cdn2.fptshop.com.vn/unsafe/150x0/filters:format(webp):quality(75)/asus_gaming_vivobook_k3605_black_1_6dec3a2e8f.png",
    description:
      "ASUS Gaming VivoBook K3605 là lựa chọn cân bằng giữa hiệu năng và thiết kế. Máy phù hợp cho học tập, lập trình, chỉnh sửa ảnh/video nhẹ và chơi game phổ thông. Tản nhiệt tối ưu hơn dòng văn phòng, bàn phím gõ sướng và ngoại hình cứng cáp.",
  },
  {
    name: "Acer Aspire Go 14 AI AG14-71M",
    category: "laptop",
    price: 10990,
    image:
      "https://cdn2.fptshop.com.vn/unsafe/150x0/filters:format(webp):quality(75)/acer_aspire_go_14_ai_ag14_71m_52lh_01_fafdeb827d.png",
    description:
      "Acer Aspire Go 14 hướng đến nhu cầu văn phòng – học tập: thiết kế nhỏ gọn, dễ di chuyển, màn hình 14 inch cân đối. Hiệu năng đủ cho công việc hằng ngày và các tác vụ đa nhiệm cơ bản. Phù hợp sinh viên hoặc người dùng cần laptop giá tốt.",
  },
  {
    name: "Dell 15 DC15255 (Silver)",
    category: "laptop",
    price: 14990,
    image:
      "https://cdn2.fptshop.com.vn/unsafe/150x0/filters:format(webp):quality(75)/dell_15_dc15255_silver_01_03285b0875.png",
    description:
      "Dell 15 nổi tiếng về độ bền và sự ổn định. Dòng 15 inch cho không gian hiển thị rộng rãi, bàn phím dễ làm quen, phù hợp văn phòng và học tập. Máy tối ưu cho các tác vụ như soạn thảo, bảng tính, họp online và giải trí cơ bản.",
  },
  {
    name: "Lenovo V15 G4 IRU (Xám)",
    category: "laptop",
    price: 10990,
    image:
      "https://cdn2.fptshop.com.vn/unsafe/150x0/filters:format(webp):quality(75)/Lenovo_V15_G4_IRU_xam_1_7ca3cff92e.jpg",
    description:
      "Lenovo V15 là dòng laptop văn phòng thực dụng: thiết kế gọn, máy chạy ổn định, phù hợp làm việc hằng ngày và học tập. Màn hình 15.6 inch thoải mái, bàn phím tốt, dễ nâng cấp theo nhu cầu sử dụng.",
  },
  {
    name: "ASUS TUF Gaming FA506NCG",
    category: "laptop",
    price: 19990,
    image:
      "https://cdn2.fptshop.com.vn/unsafe/150x0/filters:format(webp):quality(75)/asus_tuf_gaming_fa506ncg_01_a7b188268b.png",
    description:
      "ASUS TUF Gaming nổi bật nhờ độ bền chuẩn quân đội, tản nhiệt tốt và hiệu năng gaming mạnh mẽ. Phù hợp chơi game, đồ họa và các tác vụ nặng. Thiết kế đậm chất gaming, bàn phím dễ thao tác và tối ưu cho trải nghiệm dài lâu.",
  },
  {
    name: "Acer Aspire 7 Gaming A715-59G",
    category: "laptop",
    price: 17990,
    image:
      "https://cdn2.fptshop.com.vn/unsafe/150x0/filters:format(webp):quality(75)/Acer_Aspire_7_Gaming_A715_59_G_1_8776bc6007.png",
    description:
      "Acer Aspire 7 Gaming là lựa chọn 'vừa học vừa chơi' với cấu hình đủ mạnh cho lập trình, chỉnh sửa ảnh/video và game phổ thông. Thiết kế không quá hầm hố, phù hợp môi trường học tập – văn phòng nhưng vẫn có hiệu năng nhỉnh hơn dòng thường.",
  },
  {
    name: "HP 15 FD1289TU (Silver)",
    category: "laptop",
    price: 13990,
    image:
      "https://cdn2.fptshop.com.vn/unsafe/150x0/filters:format(webp):quality(75)/hp_15_fd1289tu_c2cv8pa_bac_01_367991e088.png",
    description:
      "HP 15 là laptop màn hình lớn phù hợp nhu cầu văn phòng và học tập dài giờ. Thiết kế hiện đại, bàn phím dễ gõ, màn hình 15.6 inch hỗ trợ làm việc đa nhiệm tốt hơn. Máy hướng đến sự ổn định, dễ sử dụng và độ bền theo thời gian.",
  },
  {
    name: "Lenovo Gaming LOQ E 15 (IAX 9E)",
    category: "laptop",
    price: 20990,
    image:
      "https://cdn2.fptshop.com.vn/unsafe/150x0/filters:format(webp):quality(75)/Lenovo_Gaming_LOQ_E_15_IAX_9_E_1_cb0600a2d8.png",
    description:
      "Lenovo LOQ E 15 là dòng gaming hiện đại, tối ưu hiệu năng/giá. Tản nhiệt ổn, khung máy chắc chắn, phù hợp chơi game và làm đồ họa. Thiết kế tối giản hơn gaming truyền thống, dễ mang đi học và làm việc.",
  },
  {
    name: "OPPO Find X9 (Hồng)",
    category: "phone",
    price: 18990,
    image:
      "https://cdn2.fptshop.com.vn/unsafe/150x0/filters:format(webp):quality(75)/oppo_find_x9_hong_1_86503fe881.png",
    description:
      "OPPO Find X9 hướng đến trải nghiệm cao cấp: màn hình đẹp, camera chụp chân dung tốt và hiệu năng ổn định. Thiết kế thời trang, phù hợp người dùng thích một chiếc máy mượt, chụp ảnh đẹp và dùng lâu dài mà vẫn sang trọng.",
  },
  {
    name: "Samsung Galaxy Z Flip7 (Đỏ)",
    category: "phone",
    price: 22990,
    image:
      "https://cdn2.fptshop.com.vn/unsafe/150x0/filters:format(webp):quality(75)/samsung_galaxy_z_flip7_do_1_5d87026b00.png",
    description:
      "Galaxy Z Flip7 nổi bật với thiết kế gập nhỏ gọn, thời trang. Màn hình ngoài tiện xem thông báo, chụp selfie linh hoạt. Phù hợp người dùng thích sự khác biệt, yêu cầu tính di động và trải nghiệm màn hình gập hiện đại.",
  },
  {
    name: "Samsung Galaxy Z Fold7 (Xanh)",
    category: "phone",
    price: 42990,
    image:
      "https://cdn2.fptshop.com.vn/unsafe/150x0/filters:format(webp):quality(75)/samsung_galaxy_z_fold7_xanh_1_f38c49efb2.png",
    description:
      "Galaxy Z Fold7 biến điện thoại thành một thiết bị làm việc/giải trí như tablet mini. Màn hình lớn phù hợp đọc tài liệu, đa nhiệm, xem phim. Dành cho người cần thiết bị cao cấp, linh hoạt giữa công việc và giải trí.",
  },
  {
    name: "iPhone 17",
    category: "phone",
    price: 27990,
    image:
      "https://cdn2.fptshop.com.vn/unsafe/150x0/filters:format(webp):quality(75)/iphone_17_f6390eb775.png",
    description:
      "iPhone 17 tối ưu trải nghiệm iOS mượt mà, hiệu năng cao, camera ổn định và khả năng quay video tốt. Thiết kế hiện đại, sử dụng lâu dài bền bỉ. Phù hợp người dùng ưu tiên sự ổn định, hệ sinh thái Apple và độ mượt khi dùng hằng ngày.",
  },
  {
    name: "Samsung Galaxy S24 FE (Đen)",
    category: "phone",
    price: 14990,
    image:
      "https://cdn2.fptshop.com.vn/unsafe/150x0/filters:format(webp):quality(75)/samssung_galaxy_s24_fe_dd_b946d2a8e8.png",
    description:
      "Galaxy S24 FE là lựa chọn cân bằng: màn hình đẹp, camera đa dụng và hiệu năng tốt trong tầm giá. Phù hợp người dùng muốn trải nghiệm hệ sinh thái Samsung, chụp ảnh đa cảnh và sử dụng bền bỉ cho công việc lẫn giải trí.",
  },
  {
    name: "OPPO Reno14 F (Xanh)",
    category: "phone",
    price: 10990,
    image:
      "https://cdn2.fptshop.com.vn/unsafe/150x0/filters:format(webp):quality(75)/oppo_reno14_f_xanh_0a5b091f91.jpg",
    description:
      "OPPO Reno14 F hướng đến người dùng trẻ với thiết kế đẹp, camera chụp chân dung và selfie nổi bật. Hiệu năng đủ dùng, giao diện thân thiện. Phù hợp người dùng ưu tiên chụp ảnh, mạng xã hội và một chiếc máy dễ dùng mỗi ngày.",
  },
  {
    name: "iPhone 16",
    category: "phone",
    price: 22990,
    image:
      "https://cdn2.fptshop.com.vn/unsafe/150x0/filters:format(webp):quality(75)/iphone_16_f27848b783.png",
    description:
      "iPhone 16 mang đến trải nghiệm iOS mượt, camera ổn định và hiệu năng mạnh cho cả học tập lẫn công việc. Thiết kế tinh giản, dùng lâu vẫn bền. Phù hợp người muốn một chiếc iPhone mới, ổn định và dễ sử dụng.",
  },
  {
    name: "Samsung Galaxy S24 Ultra (Đen)",
    category: "phone",
    price: 29990,
    image:
      "https://cdn2.fptshop.com.vn/unsafe/150x0/filters:format(webp):quality(75)/samsung_galaxy_s24_ultra_dd_c4cff3f16c.png",
    description:
      "Galaxy S24 Ultra là flagship mạnh mẽ với màn hình lớn, camera chụp xa tốt và hiệu năng hàng đầu. Hỗ trợ bút S Pen tiện ghi chú, làm việc. Phù hợp người dùng cao cấp cần đa nhiệm, chụp ảnh tốt và trải nghiệm toàn diện.",
  },
  {
    name: "Máy giặt iCore IWM1005",
    category: "accessory",
    price: 6990,
    image:
      "https://cdn2.fptshop.com.vn/unsafe/150x0/filters:format(webp):quality(75)/2024_5_27_638524061089080279_icore-iwm1005-thumb.jpg",
    description:
      "Máy giặt iCore IWM1005 phù hợp gia đình với nhu cầu giặt giũ hằng ngày. Thiết kế tối ưu không gian, thao tác dễ dùng, nhiều chế độ giặt cơ bản. Hướng đến sự tiện lợi, tiết kiệm thời gian và đảm bảo quần áo sạch sẽ ổn định.",
  },
  {
    name: "Chuột không dây Genius NX-7009",
    category: "accessory",
    price: 290,
    image:
      "https://cdn2.fptshop.com.vn/unsafe/150x0/filters:format(webp):quality(75)/genius_nx_7009_ce8e0c303b.png",
    description:
      "Chuột không dây Genius NX-7009 nhỏ gọn, dễ mang theo, phù hợp học tập và văn phòng. Kết nối ổn định, thao tác mượt cho các nhu cầu cơ bản. Thiết kế công thái học vừa tay, phù hợp sử dụng nhiều giờ.",
  },
  {
    name: "Chuột không dây Logitech M196 (Đen)",
    category: "accessory",
    price: 399,
    image:
      "https://cdn2.fptshop.com.vn/unsafe/150x0/filters:format(webp):quality(75)/chuot_khong_day_logitech_m196_den_5_702a8823d0.jpg",
    description:
      "Logitech M196 là chuột không dây gọn nhẹ, click êm, phù hợp văn phòng và học online. Cảm biến ổn định cho thao tác hàng ngày, thiết kế dễ cầm và bền bỉ. Lựa chọn phù hợp cho người cần sự tin cậy và đơn giản.",
  },
  {
    name: "Chuột không dây Rapoo 1630 Silent (Đen)",
    category: "accessory",
    price: 299,
    image:
      "https://cdn2.fptshop.com.vn/unsafe/150x0/filters:format(webp):quality(75)/chuot_khong_day_rapoo_1630_silent_den_4_f2ddacefd0.jpg",
    description:
      "Rapoo 1630 Silent nổi bật với click yên tĩnh, phù hợp môi trường học tập và làm việc cần sự tập trung. Thiết kế gọn, dễ mang theo, kết nối ổn định. Phù hợp người dùng muốn chuột giá tốt nhưng trải nghiệm dễ chịu.",
  },
  {
    name: "Loa Bluetooth JBL Flip 7 (Đen)",
    category: "audio",
    price: 2490,
    image:
      "https://cdn2.fptshop.com.vn/unsafe/150x0/filters:format(webp):quality(75)/loa_bluetooth_jbl_flip_7_den_4_c72c50cad5.jpg",
    description:
      "JBL Flip 7 là loa Bluetooth di động với âm bass tốt, âm lượng lớn trong thân hình gọn. Phù hợp nghe nhạc ngoài trời, picnic hoặc phòng nhỏ. Thiết kế bền bỉ, dễ cầm, phù hợp người thích loa nhỏ nhưng 'lực'.",
  },
  {
    name: "Loa Bluetooth JBL Charge 6 (Xanh)",
    category: "audio",
    price: 3490,
    image:
      "https://cdn2.fptshop.com.vn/unsafe/150x0/filters:format(webp):quality(75)/loa_bluetooth_jbl_charge_6_xanh_4_bda2580da0.jpg",
    description:
      "JBL Charge 6 cho âm thanh mạnh, bass dày, phù hợp tiệc nhỏ và nghe nhạc không gian rộng hơn. Dung lượng pin tốt, tiện mang đi chơi hoặc dùng tại nhà. Thiết kế chắc chắn, phù hợp người cần loa di động nhưng vẫn muốn âm lực.",
  },
  {
    name: "Loa Bluetooth Harman Kardon Onyx Studio 9 (Đen)",
    category: "audio",
    price: 5990,
    image:
      "https://cdn2.fptshop.com.vn/unsafe/150x0/filters:format(webp):quality(75)/Loa_Bluetooth_Harman_Kardon_Onyx_Studio_9_Den_1_ee49b76a8b.jpg",
    description:
      "Harman Kardon Onyx Studio 9 mang phong cách sang trọng, âm thanh cân bằng và giàu chi tiết. Phù hợp đặt phòng khách, phòng ngủ, nghe jazz/ballad/nhạc nhẹ. Thiết kế đẹp như vật trang trí, phù hợp người vừa cần nghe hay vừa cần đẹp.",
  },
  {
    name: "Loa Bluetooth Marshall Kilburn III (Đen)",
    category: "audio",
    price: 7490,
    image:
      "https://cdn2.fptshop.com.vn/unsafe/150x0/filters:format(webp):quality(75)/loa_bluetooth_marshall_kilburn_iii_den_4_5fe6393ab7.png",
    description:
      "Marshall Kilburn III nổi bật với thiết kế vintage, núm vặn điều khiển trực quan và chất âm đặc trưng mạnh mẽ. Phù hợp nghe rock, pop và nhiều thể loại khác. Dễ đặt trong phòng khách hoặc mang đi, phù hợp người thích phong cách Marshall.",
  },
  {
    name: "Samsung Galaxy Watch8 Classic (Đen)",
    category: "watch",
    price: 8990,
    image:
      "https://cdn2.fptshop.com.vn/unsafe/150x0/filters:format(webp):quality(75)/samsung_galaxy_watch8_classic_den_1_b9432d2763.png",
    description:
      "Galaxy Watch8 Classic phù hợp người dùng cần đồng hồ thông minh cao cấp: theo dõi sức khỏe, luyện tập, thông báo, gọi/nhắn tin cơ bản. Thiết kế cổ điển, đeo lịch sự, phù hợp cả đi làm và vận động. Hỗ trợ nhiều chế độ thể thao và theo dõi giấc ngủ.",
  },
  {
    name: "Samsung Galaxy Watch8 (Đen)",
    category: "watch",
    price: 6990,
    image:
      "https://cdn2.fptshop.com.vn/unsafe/150x0/filters:format(webp):quality(75)/samsung_galaxy_watch8_den_1_a60bc57581.png",
    description:
      "Galaxy Watch8 là lựa chọn gọn gàng để theo dõi sức khỏe và hoạt động hằng ngày: bước chân, nhịp tim, giấc ngủ và nhiều bài tập. Thiết kế trẻ trung, dễ phối đồ. Phù hợp người dùng muốn đồng hồ thông minh dễ dùng, đồng bộ tốt với điện thoại.",
  },
].map((p, idx) => ({ ...p, _id: productIds[idx] }));

/**
 * ===== COMMENT TEMPLATES (đa dạng hơn) =====
 */
const commentTemplates = [
  "Sản phẩm dùng ổn, đúng nhu cầu của mình.",
  "Đóng gói kỹ, giao hàng nhanh, chất lượng tốt.",
  "Mình thấy hiệu năng/độ mượt khá ổn trong tầm giá.",
  "Thiết kế đẹp, nhìn ngoài đời ok hơn hình.",
  "Trải nghiệm ban đầu tốt, dùng thêm sẽ cập nhật sau.",
  "Âm thanh/hình ảnh khá ổn, phù hợp dùng hàng ngày.",
  "Pin tạm ổn, mình dùng liên tục vẫn ổn.",
  "Hơi tiếc là phụ kiện/đi kèm không nhiều như mong đợi.",
  "Chất lượng hoàn thiện tốt, không bị ọp ẹp.",
  "Mình mua để học/làm việc, thấy đáp ứng tốt.",
  "Chơi game/đa nhiệm ổn, không bị giật nhiều.",
  "Camera/màn hình nhìn chung ổn trong phân khúc.",
  "Cảm giác sử dụng thoải mái, thao tác nhanh.",
  "Giá hợp lý so với những gì nhận được.",
  "Mình sẽ cân nhắc mua lại hoặc giới thiệu cho bạn bè.",
  "Sản phẩm tạm ổn, có điểm cộng nhưng cũng có điểm trừ.",
  "Màu sắc đẹp, đúng mô tả, không bị lệch nhiều.",
  "Kết nối ổn định, dùng không gặp vấn đề gì.",
  "Có vài điểm nhỏ cần cải thiện nhưng nhìn chung ok.",
  "Đáng tiền, phù hợp với nhu cầu cơ bản.",
];

/**
 * Utils: shuffle (xáo trộn) mảng
 */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * ===== RANDOM REVIEW GENERATOR (mỗi user chỉ 1 review / product) =====
 */
function randomReviewsForProduct(productId) {
  const reviewCount = randomInt(MIN_REVIEWS_PER_PRODUCT, MAX_REVIEWS_PER_PRODUCT);

  // Chọn user không trùng cho mỗi sản phẩm
  // (49 users thường -> đủ để chọn 30-40 user unique)
  const chosenUsers = shuffle(normalUserIds).slice(0, reviewCount);

  return chosenUsers.map((uid) => ({
    _id: new Types.ObjectId(),
    user: uid,
    product: productId,
    rating: randomInt(1, 5),
    comment: commentTemplates[Math.floor(Math.random() * commentTemplates.length)],
  }));
}

async function updateAverageRatingForProduct(productId) {
  const stats = await Review.aggregate([
    { $match: { product: productId } },
    { $group: { _id: "$product", avgRating: { $avg: "$rating" } } },
  ]);

  await Product.findByIdAndUpdate(productId, {
    averageRating: stats.length ? stats[0].avgRating : 0,
  });
}

/**
 * ===== MAIN SEED FUNCTION =====
 */
async function seedDatabase() {
  try {
    await connectDB();

    await User.deleteMany();
    await Product.deleteMany();
    await Review.deleteMany();

    // Insert users + products
    await User.insertMany(await buildUsers());
    await Product.insertMany(productCatalog);

    // Reviews: mỗi product 30-40 review, user không trùng trong 1 product
    const reviews = [];
    for (const pid of productIds) {
      reviews.push(...randomReviewsForProduct(pid));
    }
    await Review.insertMany(reviews);

    // Update rating
    for (const pid of productIds) {
      await updateAverageRatingForProduct(pid);
    }

    console.log("✔ SEED COMPLETE");
    console.log(`Users: ${TOTAL_USERS} (1 admin + ${TOTAL_USERS - 1} users)`);
    console.log(`Products: ${TOTAL_PRODUCTS}`);
    console.log(
      `Reviews: ~${TOTAL_PRODUCTS * MIN_REVIEWS_PER_PRODUCT} - ${TOTAL_PRODUCTS * MAX_REVIEWS_PER_PRODUCT}`
    );

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedDatabase();
