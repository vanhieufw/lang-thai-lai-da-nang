(() => {
  const formatMoney = (n) => (Number(n) || 0).toLocaleString("vi-VN") + " đ";
  const pointsKey = "thai-lai-su-gia-points";
  const cartKey = "thai-lai-cart";
  const redeemKey = "thai-lai-redeem-history";

  // ========== POINTS ==========
  function getPoints() {
    try { return Number(localStorage.getItem(pointsKey) || 0); } catch { return 0; }
  }
  function setPoints(n) {
    try { localStorage.setItem(pointsKey, String(Math.max(0, n))); } catch {}
    document.querySelectorAll("[data-su-gia-points]").forEach((el) => { el.textContent = getPoints(); });
  }
  function addPoints(pts) {
    setPoints(getPoints() + pts);
  }

  // ========== BOOKING ==========
  const dialog = document.querySelector("#booking-dialog");
  if (dialog) {
    const form = dialog.querySelector("#booking-form");
    const packageEl = dialog.querySelector("[data-booking-package]");
    const depositEl = dialog.querySelector("[data-booking-deposit]");
    const totalEl = dialog.querySelector("[data-booking-total]");
    const body = dialog.querySelector(".booking-body");
    const qrBox = dialog.querySelector(".booking-qr");
    const successBox = dialog.querySelector(".booking-success");
    const ticketCode = dialog.querySelector("[data-ticket-code]");
    const ticketDetail = dialog.querySelector("[data-ticket-detail]");
    const epassInfo = dialog.querySelector("[data-epass-info]");
    const zaloMsg = dialog.querySelector("[data-zalo-msg]");
    const qrAmount = dialog.querySelector("[data-qr-amount]");
    const steps = dialog.querySelectorAll(".booking-steps .step");

    const packages = {
      1: { name: "Về Làng An Yên", price: 99000, deposit: 30000 },
      2: { name: "Nông Dân Thái Lai", price: 199000, deposit: 60000 },
      3: { name: "Nông Nghiệp Xanh & Bài Chòi", price: 279000, deposit: 80000 }
    };
    let currentPkg = null;
    let lastFormData = null;

    function setStep(n) {
      steps.forEach((s, i) => s.classList.toggle("is-active", i === n));
    }

    function openBooking(pkgId) {
      currentPkg = packages[pkgId];
      if (!currentPkg) return;
      packageEl.textContent = `Gói: ${currentPkg.name} — ${formatMoney(currentPkg.price)}/khách · Cọc ${formatMoney(currentPkg.deposit)}/người`;
      body.hidden = false;
      qrBox.hidden = true;
      successBox.hidden = true;
      form.reset();
      const dateInput = form.querySelector('[name="date"]');
      if (dateInput) {
        const today = new Date().toISOString().slice(0, 10);
        dateInput.min = today;
        dateInput.value = today;
      }
      updateDeposit();
      setStep(0);
      dialog.showModal();
    }

    function updateDeposit() {
      if (!currentPkg) return;
      const guests = Number(form.querySelector('[name="guests"]').value) || 1;
      depositEl.textContent = formatMoney(currentPkg.deposit * guests);
      if (totalEl) totalEl.textContent = formatMoney(currentPkg.price * guests);
      if (qrAmount) qrAmount.textContent = formatMoney(currentPkg.deposit * guests);
    }

    form.querySelector('[name="guests"]')?.addEventListener("input", updateDeposit);

    document.querySelectorAll("[data-book-tour]").forEach((btn) => {
      btn.addEventListener("click", () => openBooking(btn.dataset.package));
    });

    dialog.querySelectorAll("[data-close-booking], [data-close-success]").forEach((btn) => {
      btn.addEventListener("click", () => dialog.close());
    });
    dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!currentPkg) return;
      const data = new FormData(form);
      lastFormData = {
        name: (data.get("name") || "Khách").toString().trim(),
        phone: (data.get("phone") || "").toString().trim(),
        date: data.get("date"),
        slot: data.get("slot"),
        guests: Number(data.get("guests")) || 1,
        note: (data.get("note") || "").toString().trim()
      };
      body.hidden = true;
      qrBox.hidden = false;
      successBox.hidden = true;
      setStep(1);
      updateDeposit();
    });

    dialog.querySelector("[data-back-form]")?.addEventListener("click", () => {
      body.hidden = false;
      qrBox.hidden = true;
      setStep(0);
    });

    dialog.querySelector("[data-confirm-pay]")?.addEventListener("click", () => {
      if (!currentPkg || !lastFormData) return;
      const deposit = currentPkg.deposit * lastFormData.guests;
      const code = "#TL-" + (8000 + Math.floor(Math.random() * 1999));
      const slotText = lastFormData.slot === "sang" ? "Sáng 09h00–10h30" : "Chiều 14h30–16h00";

      try {
        sessionStorage.setItem("thai-lai-last-booking", JSON.stringify({
          code, ...lastFormData, package: currentPkg.name, deposit, at: Date.now()
        }));
      } catch {}

      qrBox.hidden = true;
      successBox.hidden = false;
      setStep(2);
      ticketCode.textContent = code;
      ticketDetail.textContent = `Họ tên: ${lastFormData.name} · ${lastFormData.guests} khách · Ngày ${lastFormData.date} · ${slotText}`;
      if (epassInfo) {
        epassInfo.innerHTML = `<strong>${lastFormData.name}</strong><br>${currentPkg.name}<br>${lastFormData.date} · ${slotText}<br>${lastFormData.guests} khách · Cọc ${formatMoney(deposit)}`;
      }
      zaloMsg.textContent = `Kính chào anh/chị ${lastFormData.name}, HTX Du lịch Thái Lai xác nhận đã nhận ${formatMoney(deposit)} tiền cọc. Bác Đỗ Hữu Minh và Chú Trưởng thôn đã nhận lịch đón đoàn vào ${slotText} ngày ${lastFormData.date}. Vị trí tập kết: Nhà văn hóa thôn Thái Lai (có sân ô tô râm mát). Bấm link xem bản đồ chỉ đường...`;
      addPoints(5);
    });
  }

  // ========== CART ==========
  const drawer = document.querySelector("#cart-drawer");
  const cartItemsEl = document.querySelector("[data-cart-items]");
  const cartEmpty = document.querySelector("[data-cart-empty]");
  const cartFooter = document.querySelector("[data-cart-footer]");
  const cartTotal = document.querySelector("[data-cart-total]");
  const cartCountEls = document.querySelectorAll("[data-cart-count]");
  const fabCount = document.querySelector("[data-cart-fab-count]");
  const addressBox = document.querySelector("[data-cart-address]");

  function getCart() {
    try { return JSON.parse(sessionStorage.getItem(cartKey) || "[]"); } catch { return []; }
  }
  function saveCart(cart) {
    try { sessionStorage.setItem(cartKey, JSON.stringify(cart)); } catch {}
    renderCart();
  }

  function renderCart() {
    const cart = getCart();
    const count = cart.reduce((s, i) => s + i.qty, 0);
    cartCountEls.forEach((el) => { el.textContent = `(${count})`; });
    if (fabCount) {
      fabCount.textContent = count;
      fabCount.hidden = count === 0;
    }

    if (!cartItemsEl) return;
    if (cart.length === 0) {
      if (cartEmpty) cartEmpty.hidden = false;
      if (cartFooter) cartFooter.hidden = true;
      cartItemsEl.querySelectorAll(".cart-line").forEach((n) => n.remove());
      return;
    }
    if (cartEmpty) cartEmpty.hidden = true;
    if (cartFooter) cartFooter.hidden = false;

    cartItemsEl.querySelectorAll(".cart-line").forEach((n) => n.remove());
    let total = 0;
    cart.forEach((item, idx) => {
      total += item.price * item.qty;
      const row = document.createElement("div");
      row.className = "cart-line";
      row.innerHTML = `
        <div class="cart-line-img" aria-hidden="true">👜</div>
        <div class="cart-line-info">
          <strong>${item.name}</strong>
          <span>${formatMoney(item.price)} × ${item.qty}</span>
        </div>
        <div class="cart-line-actions">
          <button type="button" data-qty-minus data-idx="${idx}" aria-label="Giảm">−</button>
          <button type="button" data-qty-plus data-idx="${idx}" aria-label="Tăng">+</button>
          <button type="button" data-remove data-idx="${idx}" aria-label="Xóa">✕</button>
        </div>
      `;
      cartItemsEl.append(row);
    });
    if (cartTotal) cartTotal.textContent = formatMoney(total);

    cartItemsEl.querySelectorAll("[data-qty-minus]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const c = getCart();
        const i = Number(btn.dataset.idx);
        if (c[i].qty > 1) c[i].qty -= 1; else c.splice(i, 1);
        saveCart(c);
      });
    });
    cartItemsEl.querySelectorAll("[data-qty-plus]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const c = getCart();
        c[Number(btn.dataset.idx)].qty += 1;
        saveCart(c);
      });
    });
    cartItemsEl.querySelectorAll("[data-remove]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const c = getCart();
        c.splice(Number(btn.dataset.idx), 1);
        saveCart(c);
      });
    });
  }

  document.querySelectorAll("[data-add-tote]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name || (btn.dataset.type === "combo" ? "Combo Túi + Tour An Yên" : "Túi Tote Thái Lai Ký Tự");
      const price = Number(btn.dataset.price) || (btn.dataset.type === "combo" ? 199000 : 149000);
      const id = btn.dataset.type === "combo" ? "combo" : "tote";
      const cart = getCart();
      const existing = cart.find((i) => i.id === id);
      if (existing) existing.qty += 1;
      else cart.push({ id, name, price, qty: 1 });
      saveCart(cart);
      if (drawer) {
        drawer.hidden = false;
        document.body.style.overflow = "hidden";
      }
    });
  });

  document.querySelector("[data-open-cart]")?.addEventListener("click", () => {
    if (drawer) {
      drawer.hidden = false;
      document.body.style.overflow = "hidden";
      renderCart();
    }
  });
  document.querySelector("[data-close-cart]")?.addEventListener("click", () => {
    if (drawer) {
      drawer.hidden = true;
      document.body.style.overflow = "";
    }
  });
  drawer?.addEventListener("click", (e) => {
    if (e.target === drawer) {
      drawer.hidden = true;
      document.body.style.overflow = "";
    }
  });

  document.querySelectorAll('input[name="ship"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      if (addressBox) addressBox.hidden = radio.value !== "ship";
      renderCart();
    });
  });

  document.querySelector("[data-checkout]")?.addEventListener("click", () => {
    const cart = getCart();
    if (!cart.length) return;
    const ship = document.querySelector('input[name="ship"]:checked')?.value || "pickup";
    let total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    if (ship === "ship") total += 20000;
    const code = "DH-" + Date.now().toString().slice(-6);

    let msg = `Đặt hàng thành công!\nMã đơn: ${code}\n`;
    cart.forEach((i) => { msg += `• ${i.name} x${i.qty}\n`; });
    msg += `Tổng: ${formatMoney(total)}\n`;
    msg += ship === "pickup"
      ? "Hình thức: Nhận tại Cổng làng / Nhà văn hóa thôn Thái Lai."
      : "Hình thức: Ship nội thành Đà Nẵng.";
    msg += "\n\nCó thể dùng mã TL-8921 trên túi để kích hoạt Hộ chiếu Thái Lai.";

    try { sessionStorage.setItem("thai-lai-last-order", JSON.stringify({ code, items: cart, total, ship, at: Date.now() })); } catch {}
    alert(msg);
    saveCart([]);
    if (drawer) {
      drawer.hidden = true;
      document.body.style.overflow = "";
    }
    addPoints(8);
    const lastOrderEl = document.querySelector("[data-last-order]");
    if (lastOrderEl) lastOrderEl.textContent = "Đơn gần nhất: " + code + " — có thể hủy trong phiên này.";
  });

  document.querySelector("[data-cancel-cart]")?.addEventListener("click", () => {
    const cart = getCart();
    let last = null;
    try { last = JSON.parse(sessionStorage.getItem("thai-lai-last-order") || "null"); } catch {}
    if (!cart.length && !last) {
      alert("Giỏ đang trống và chưa có đơn hàng trong phiên này.");
      return;
    }
    if (cart.length) {
      if (!confirm("Hủy đặt hàng và xóa toàn bộ giỏ hiện tại?")) return;
      saveCart([]);
      alert("Đã hủy đặt hàng · Giỏ hàng đã được xóa.");
    } else if (last) {
      if (!confirm(`Hủy đơn ${last.code} (tổng ${formatMoney(last.total)})?`)) return;
      try { sessionStorage.removeItem("thai-lai-last-order"); } catch {}
      const lastOrderEl = document.querySelector("[data-last-order]");
      if (lastOrderEl) lastOrderEl.textContent = "Đã hủy đơn " + last.code + ".";
      alert("Đã hủy đơn " + last.code + ".");
    }
    if (drawer) {
      drawer.hidden = true;
      document.body.style.overflow = "";
    }
  });

  document.querySelector("[data-add-test-points]")?.addEventListener("click", () => {
    addPoints(100);
    const el = document.querySelector("[data-su-gia-points]");
    alert("Đã cộng +100 điểm (chế độ test giám khảo). Điểm hiện tại: " + (el ? el.textContent : getPoints()));
  });

  // ========== ACTIVATE TOTE ==========
  const activateInput = document.querySelector("[data-activate-code]");
  const activateBtn = document.querySelector("[data-activate-btn]");
  const activateResult = document.querySelector("[data-activate-result]");

  activateBtn?.addEventListener("click", () => {
    const code = (activateInput?.value || "").trim().toUpperCase();
    if (!activateResult) return;
    if (code === "TL-8921" || /^TL-\d{3,5}$/.test(code)) {
      activateResult.hidden = false;
      activateResult.className = "activate-result is-ok";
      activateResult.innerHTML = `
        <strong>✓ Kích hoạt Hộ chiếu Thái Lai thành công</strong>
        <ul>
          <li><strong>Coupon 1:</strong> 01 Ấm trà sen mộc + bánh mè nướng tại Tích Thiện Đường</li>
          <li><strong>Coupon 2:</strong> 01 Suất tự tay xay cối đá đúc bánh xèo tại vườn</li>
          <li><strong>Coupon 3:</strong> Giảm 15% chai dầu đậu phộng OCOP 3 sao</li>
        </ul>
        <p>Giơ màn hình hoặc đeo túi cho bà con xem để nhận phục vụ. Bạn cũng có thể vào phần <a href="#do-vui">Săn kho báu</a> ngay.</p>
      `;
      addPoints(10);
    } else {
      activateResult.hidden = false;
      activateResult.className = "activate-result is-err";
      activateResult.innerHTML = `Mã không hợp lệ. Thử mã mẫu <strong>TL-8921</strong>.`;
    }
  });

  // ========== REDEEM ==========
  function getRedeemHistory() {
    try { return JSON.parse(sessionStorage.getItem(redeemKey) || "[]"); } catch { return []; }
  }
  function saveRedeemHistory(list) {
    try { sessionStorage.setItem(redeemKey, JSON.stringify(list)); } catch {}
  }

  function renderRedeemHistory() {
    const list = getRedeemHistory();
    const box = document.querySelector("[data-redeem-history]");
    const grid = document.querySelector("[data-redeem-list]");
    if (!box || !grid) return;
    if (!list.length) {
      box.hidden = true;
      return;
    }
    box.hidden = false;
    grid.innerHTML = list.map((g) => `
      <article class="redeemed-card">
        <div class="redeemed-photo">${g.img ? `<img src="${g.img}" alt="" width="120" height="120" loading="lazy">` : ""}</div>
        <div class="redeemed-info">
          <strong class="redeemed-code">${g.code}</strong>
          <p>${g.gift}</p>
          <span class="redeemed-cost">−${g.cost} điểm</span>
        </div>
      </article>
    `).join("");
  }

  document.querySelectorAll("[data-redeem]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".redeem-item");
      if (!item) return;
      const cost = Number(item.dataset.cost);
      const gift = item.dataset.gift;
      const img = item.dataset.img || "";
      const pts = getPoints();
      if (pts < cost) {
        alert(`Bạn cần ${cost} điểm. Hiện có ${pts} điểm. Hãy hoàn thành săn kho báu hoặc mời bạn bè qua link Sứ giả.`);
        return;
      }
      setPoints(pts - cost);
      const code = "QUA-" + (1000 + Math.floor(Math.random() * 8999));
      const hist = getRedeemHistory();
      hist.unshift({ code, gift, cost, img, at: Date.now() });
      saveRedeemHistory(hist);
      renderRedeemHistory();
      alert(`Đổi quà thành công!\nMã đổi: ${code}\nQuà: ${gift}\n\nMang mã này đến Nhà văn hóa thôn Thái Lai để nhận quà.`);
    });
  });

  // ========== SỨ GIẢ SHARE (chỉ copy link, điểm khi bạn bè thật sự mở) ==========
  const myRefKey = "thai-lai-my-ref";
  function getOrCreateMyRef() {
    try {
      let ref = localStorage.getItem(myRefKey);
      if (!ref) {
        ref = "su-gia-" + Math.random().toString(36).slice(2, 10);
        localStorage.setItem(myRefKey, ref);
      }
      return ref;
    } catch {
      return "su-gia-" + Math.random().toString(36).slice(2, 10);
    }
  }

  document.querySelector("[data-share-su-gia]")?.addEventListener("click", async () => {
    const base = location.href.split("?")[0].split("#")[0];
    const link = base + "?ref=" + getOrCreateMyRef();
    const statusEl = document.querySelector("[data-su-gia-status]");
    try {
      await navigator.clipboard.writeText(link);
      if (statusEl) statusEl.textContent = "Đã sao chép link Sứ giả. Điểm chỉ được cộng khi bạn bè mở link này.";
    } catch {
      if (statusEl) statusEl.textContent = "Link: " + link;
    }
    // Không cộng điểm khi chỉ copy
  });

  document.querySelector("[data-open-zalo-share]")?.addEventListener("click", () => {
    const base = location.href.split("?")[0].split("#")[0];
    const link = base + "?ref=" + getOrCreateMyRef();
    const text = encodeURIComponent("Cùng khám phá làng Thái Lai bên sông Túy Loan nhé! " + link);
    window.open("https://zalo.me/share?url=" + encodeURIComponent(link) + "&text=" + text, "_blank");
    const statusEl = document.querySelector("[data-su-gia-status]");
    if (statusEl) statusEl.textContent = "Đã mở chia sẻ Zalo. Điểm được cộng khi bạn bè mở link của bạn.";
  });

  // Bạn bè mở link → cộng điểm cho chủ link (lưu trên thiết bị chủ khi họ quay lại, hoặc cộng cho visitor + báo)
  // Cơ chế demo chuyên nghiệp: khi mở bằng ref, lưu lượt referral; chủ link khi vào lại sẽ nhận điểm chờ
  try {
    const params = new URLSearchParams(location.search);
    const ref = params.get("ref");
    if (ref && ref.startsWith("su-gia-")) {
      const myRef = getOrCreateMyRef();
      if (ref !== myRef) {
        // Đây là khách được giới thiệu → ghi nhận lượt cho chủ ref
        const pendingKey = "thai-lai-pending-refs";
        let pending = {};
        try { pending = JSON.parse(localStorage.getItem(pendingKey) || "{}"); } catch {}
        // Lưu trên trình duyệt hiện tại một flag; thực tế cần backend.
        // Để demo: cộng điểm cho người đang mở (khách) nhỏ, và lưu "claimed" theo ref+day
        const claimKey = "thai-lai-ref-claimed-" + ref;
        if (!sessionStorage.getItem(claimKey)) {
          sessionStorage.setItem(claimKey, "1");
          // Cộng điểm cho chủ ref bằng cách ghi vào localStorage key theo ref (nếu cùng máy demo) 
          // và luôn cộng cho người mở để thấy hiệu ứng
          try {
            const ownerPtsKey = "thai-lai-owner-pts-" + ref;
            const ownerPts = Number(localStorage.getItem(ownerPtsKey) || 0) + 15;
            localStorage.setItem(ownerPtsKey, String(ownerPts));
          } catch {}
          // Nếu chính máy này từng tạo ref đó → cộng luôn vào điểm chính
          if (localStorage.getItem(myRefKey) === ref || true) {
            // Khi chủ mở lại link của mình có ref thì nhận điểm pending
          }
        }
      }
      history.replaceState(null, "", location.pathname + location.hash);
    }
    // Nhận điểm pending nếu có người dùng link của mình
    const myRef = getOrCreateMyRef();
    const ownerPtsKey = "thai-lai-owner-pts-" + myRef;
    try {
      const pendingPts = Number(localStorage.getItem(ownerPtsKey) || 0);
      if (pendingPts > 0) {
        addPoints(pendingPts);
        localStorage.setItem(ownerPtsKey, "0");
        const statusEl = document.querySelector("[data-su-gia-status]");
        if (statusEl) statusEl.textContent = `Bạn vừa nhận +${pendingPts} điểm từ bạn bè mở link Sứ giả.`;
      }
    } catch {}
  } catch {}

  // ========== ZALO CHAT WIDGET ==========
  const zaloPanel = document.querySelector("[data-zalo-panel]");
  const zaloMessages = document.querySelector("[data-zalo-messages]");
  const zaloForm = document.querySelector("[data-zalo-form]");
  const zaloInput = document.querySelector("[data-zalo-input]");

  const botReplies = {
    "Lộ trình từ Đà Nẵng đi Thái Lai thế nào?": "Từ trung tâm Đà Nẵng đi Hòa Vang hướng Bà Nà, vào thôn Thái Lai. Điểm tập kết: Nhà văn hóa thôn Thái Lai (có sân đậu xe). Anh/chị có thể bấm “Chỉ đường” trên web nhé!",
    "Khung giờ đón đoàn sáng/chiều?": "Sáng: 09h00 – 10h30 · Chiều: 14h30 – 16h00. Đặt trước để bác chủ nhà cổ và hộ làm bánh chuẩn bị kịp ạ.",
    "Có thể đặt suất ăn chay không?": "Được ạ. Ghi chú “suất chay” khi đặt tour hoặc nhắn em, làng sẽ chuẩn bị rau sạch + bánh ít lá gai.",
    "Nhà cổ có cần hỏi gia chủ trước không?": "Có ạ. Nhà cổ Tích Thiện Đường là nhà của gia đình. Luôn hỏi gia chủ trước khi vào hoặc chụp ảnh trong nhà để tôn trọng không gian riêng."
  };

  function appendMsg(text, who) {
    if (!zaloMessages) return;
    const div = document.createElement("div");
    div.className = "zalo-msg " + who;
    div.textContent = text;
    zaloMessages.append(div);
    zaloMessages.scrollTop = zaloMessages.scrollHeight;
  }

  document.querySelector("[data-toggle-zalo]")?.addEventListener("click", () => {
    if (!zaloPanel) return;
    zaloPanel.hidden = !zaloPanel.hidden;
  });
  document.querySelector("[data-close-zalo]")?.addEventListener("click", () => {
    if (zaloPanel) zaloPanel.hidden = true;
  });

  document.querySelectorAll("[data-zalo-q]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const q = btn.dataset.zaloQ;
      appendMsg(q, "user");
      setTimeout(() => {
        appendMsg(botReplies[q] || "Em đã nhận câu hỏi. Đội thanh niên sẽ trả lời ngay trong vài phút .", "bot");
      }, 600);
    });
  });

  zaloForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = (zaloInput?.value || "").trim();
    if (!text) return;
    appendMsg(text, "user");
    zaloInput.value = "";
    setTimeout(() => {
      appendMsg("Cảm ơn anh/chị. Em đã chuyển nội dung cho đội hỗ trợ. Trong giờ hành chính sẽ phản hồi qua Zalo OA thật .", "bot");
    }, 700);
  });

  // ========== HỦY / ĐỔI LỊCH TOUR ==========
  const cancelDialog = document.querySelector("#cancel-dialog");
  document.querySelectorAll("[data-open-cancel]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (dialog?.open) dialog.close();
      const resultEl = cancelDialog?.querySelector("[data-cancel-result]");
      if (resultEl) { resultEl.hidden = true; resultEl.innerHTML = ""; }
      const input = cancelDialog?.querySelector("[data-cancel-code]");
      if (input) {
        try {
          const last = JSON.parse(sessionStorage.getItem("thai-lai-last-booking") || "null");
          if (last?.code) input.value = last.code;
        } catch {}
      }
      cancelDialog?.showModal();
    });
  });
  cancelDialog?.querySelector("[data-close-cancel]")?.addEventListener("click", () => cancelDialog.close());
  cancelDialog?.addEventListener("click", (e) => { if (e.target === cancelDialog) cancelDialog.close(); });

  cancelDialog?.querySelector("[data-lookup-booking]")?.addEventListener("click", () => {
    const code = (cancelDialog.querySelector("[data-cancel-code]")?.value || "").trim().toUpperCase();
    const resultEl = cancelDialog.querySelector("[data-cancel-result]");
    if (!resultEl) return;
    let booking = null;
    try {
      const last = JSON.parse(sessionStorage.getItem("thai-lai-last-booking") || "null");
      if (last && String(last.code).toUpperCase() === code) booking = last;
    } catch {}
    resultEl.hidden = false;
    if (!booking) {
      resultEl.innerHTML = `<p style="color:#8b1e1e">Không tìm thấy mã vé <strong>${code || "(trống)"}</strong> trên thiết bị này. Hãy đặt tour trước hoặc kiểm tra lại mã.</p>`;
      return;
    }
    const slotText = booking.slot === "sang" ? "Sáng 09h00–10h30" : "Chiều 14h30–16h00";
    resultEl.innerHTML = `
      <div class="epass-card" style="margin-bottom:.75rem">
        <p class="epass-title">Thông tin đặt chỗ</p>
        <p><strong>${booking.name}</strong><br>${booking.package}<br>${booking.date} · ${slotText}<br>${booking.guests} khách · Cọc ${formatMoney(booking.deposit)}</p>
      </div>
      <p><strong>Chọn thao tác:</strong></p>
      <div style="display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.5rem">
        <button type="button" class="button button-gold" data-do-cancel-full>Hủy trước 24h · Hoàn cọc / Bảo lưu</button>
        <button type="button" class="button button-light" data-do-cancel-late>Hủy sát giờ (không hoàn cọc)</button>
      </div>
    `;
    resultEl.querySelector("[data-do-cancel-full]")?.addEventListener("click", () => {
      const retain = "BL-" + Date.now().toString().slice(-6);
      resultEl.innerHTML = `<p style="color:#1b5e20"><strong>Đã hủy thành công.</strong><br>Tiền cọc được hoàn 100% hoặc cấp <strong>Mã Bảo Lưu ${retain}</strong> (dời lịch trong 60 ngày, không mất phí).<br>Tin xác nhận sẽ gửi qua Zalo/SMS.</p>`;
      try { sessionStorage.removeItem("thai-lai-last-booking"); } catch {}
    });
    resultEl.querySelector("[data-do-cancel-late]")?.addEventListener("click", () => {
      resultEl.innerHTML = `<p style="color:#5c4033"><strong>Đã ghi nhận hủy sát giờ.</strong><br>Tiền cọc không hoàn lại và được chuyển hỗ trợ hộ dân làng Thái Lai (nguyên liệu bánh, rau, trà mộc đã chuẩn bị).</p>`;
      try { sessionStorage.removeItem("thai-lai-last-booking"); } catch {}
    });
  });

  // init
  setPoints(getPoints());
  renderCart();
  renderRedeemHistory();
})();
