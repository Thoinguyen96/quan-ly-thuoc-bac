import "./ToaThuoc.css";

function ToaThuoc({
    toaThuoc,
    setToaThuoc,
    tenViThuoc,
    setTenViThuoc,
    soLuongViThuoc,
    setSoLuongViThuoc,
    themViThuocVaoToa,
    danhSachViThuoc,
    setDanhSachViThuoc,
    luuToaThuoc,
    taiLichSuBenhNhan,
    setTrang,
}) {
    return (
        <div className="toa-thuoc-container">
            <div className="toa-thuoc-header">
                <h1>📄 TOA THUỐC Y HỌC CỔ TRUYỀN</h1>
            </div>

            <h3>THÔNG TIN BỆNH NHÂN</h3>

            <input
                type="text"
                placeholder="Họ và tên bệnh nhân"
                value={toaThuoc.ho_ten}
                onChange={(e) =>
                    setToaThuoc({
                        ...toaThuoc,
                        ho_ten: e.target.value,
                    })
                }
            />

            <div className="toa-hang-ngang">
                <input
                    type="number"
                    placeholder="Năm sinh"
                    value={toaThuoc.nam_sinh}
                    onChange={(e) =>
                        setToaThuoc({
                            ...toaThuoc,
                            nam_sinh: e.target.value,
                        })
                    }
                />

                <select
                    value={toaThuoc.gioi_tinh}
                    onChange={(e) =>
                        setToaThuoc({
                            ...toaThuoc,
                            gioi_tinh: e.target.value,
                        })
                    }
                >
                    <option value="">Giới tính</option>
                    <option value="nam">Nam</option>
                    <option value="nu">Nữ</option>
                </select>
            </div>

            <input
                type="text"
                placeholder="Số điện thoại"
                value={toaThuoc.so_dien_thoai}
                onChange={(e) =>
                    setToaThuoc({
                        ...toaThuoc,
                        so_dien_thoai: e.target.value,
                    })
                }
            />

            <input
                type="text"
                placeholder="Địa chỉ"
                value={toaThuoc.dia_chi}
                onChange={(e) =>
                    setToaThuoc({
                        ...toaThuoc,
                        dia_chi: e.target.value,
                    })
                }
            />

            <h3>THÔNG TIN KHÁM BỆNH</h3>

            <textarea
                placeholder="Triệu chứng / Lý do đến khám"
                rows="3"
                value={toaThuoc.trieu_chung}
                onChange={(e) =>
                    setToaThuoc({
                        ...toaThuoc,
                        trieu_chung: e.target.value,
                    })
                }
            />

            <textarea
                placeholder="Tiền sử bệnh"
                rows="2"
                value={toaThuoc.tien_su_benh}
                onChange={(e) =>
                    setToaThuoc({
                        ...toaThuoc,
                        tien_su_benh: e.target.value,
                    })
                }
            />

            <textarea
                placeholder="Chẩn đoán"
                rows="2"
                value={toaThuoc.chan_doan}
                onChange={(e) =>
                    setToaThuoc({
                        ...toaThuoc,
                        chan_doan: e.target.value,
                    })
                }
            />

            <textarea
                placeholder="Chẩn đoán Y học cổ truyền / Thể bệnh"
                rows="2"
                value={toaThuoc.chan_doan_yhct}
                onChange={(e) =>
                    setToaThuoc({
                        ...toaThuoc,
                        chan_doan_yhct: e.target.value,
                    })
                }
            />

            <textarea
                placeholder="Pháp điều trị"
                rows="2"
                value={toaThuoc.phap_dieu_tri}
                onChange={(e) =>
                    setToaThuoc({
                        ...toaThuoc,
                        phap_dieu_tri: e.target.value,
                    })
                }
            />

            <h3>ĐƠN THUỐC</h3>

            <div className="toa-hang-ngang">
                <input
                    type="text"
                    placeholder="Tên vị thuốc"
                    value={tenViThuoc}
                    onChange={(e) => setTenViThuoc(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Số lượng (g)"
                    value={soLuongViThuoc}
                    onChange={(e) => setSoLuongViThuoc(e.target.value)}
                />
            </div>

            <button onClick={themViThuocVaoToa}>➕ Thêm vị thuốc</button>

            <div className="danh-sach-toa">
                {danhSachViThuoc.length === 0 ? (
                    <p>Chưa có vị thuốc nào trong toa.</p>
                ) : (
                    danhSachViThuoc.map((thuoc, index) => (
                        <div className="toa-thuoc-item" key={index}>
                            <span>
                                {index + 1}. <strong>{thuoc.ten}</strong> — {thuoc.soLuong}g
                            </span>

                            <button onClick={() => setDanhSachViThuoc(danhSachViThuoc.filter((_, i) => i !== index))}>
                                ❌
                            </button>
                        </div>
                    ))
                )}
            </div>

            <h3>CÁCH DÙNG VÀ LỜI DẶN</h3>

            <textarea
                placeholder="Cách sắc thuốc / Cách dùng"
                rows="3"
                value={toaThuoc.cach_dung}
                onChange={(e) =>
                    setToaThuoc({
                        ...toaThuoc,
                        cach_dung: e.target.value,
                    })
                }
            />

            <textarea
                placeholder="Lời dặn bệnh nhân"
                rows="3"
                value={toaThuoc.loi_dan}
                onChange={(e) =>
                    setToaThuoc({
                        ...toaThuoc,
                        loi_dan: e.target.value,
                    })
                }
            />

            <input
                type="number"
                placeholder="Số thang"
                value={toaThuoc.so_thang}
                onChange={(e) =>
                    setToaThuoc({
                        ...toaThuoc,
                        so_thang: e.target.value,
                    })
                }
            />

            <div className="toa-nut-chuc-nang">
                <button onClick={luuToaThuoc}>💾 Lưu toa</button>

                <button
                    onClick={async () => {
                        await taiLichSuBenhNhan();
                        setTrang("benhnhan");
                    }}
                >
                    📋 Bệnh nhân
                </button>

                <button onClick={() => window.print()}>🖨️ In toa thuốc</button>

                <button onClick={() => setTrang("trangchu")}>← Quay lại trang chủ</button>
            </div>
        </div>
    );
}

export default ToaThuoc;
