import "./KhoThuoc.css";
import PopupXacNhan from "../PopupXacNhan/PopupXacNhan";
import { toast } from "react-hot-toast";

function KhoThuoc({
    user,
    setTrang,
    laAdmin,
    tenThuocMoi,
    setTenThuocMoi,
    giaThuocMoi,
    setGiaThuocMoi,
    tonKhoMoi,
    setTonKhoMoi,
    themThuocMoi,
    tuKhoaKho,
    setTuKhoaKho,
    danhSachThuocTrongKho,
    thuocDangSua,
    setThuocDangSua,
    tenThuocSua,
    setTenThuocSua,
    giaThuocSua,
    setGiaThuocSua,
    tonKhoSua,
    setTonKhoSua,
    batDauSuaThuoc,
    luuSuaThuoc,
    huySuaThuoc,
    setThuocChoXoa,
    thuocChoXoa,
    xoaThuocKho,
}) {
    if (!laAdmin && user?.quyen_kho_thuoc !== true) {
        toast.error("Bạn không có quyền vào kho thuốc!");
        setTrang("trangchu");
        return null;
    }

    return (
        <div>
            <div className="container">
                <h1>📦 KHO THUỐC</h1>

                <h2>➕ Thêm thuốc mới</h2>

                <input
                    type="text"
                    placeholder="Tên thuốc"
                    value={tenThuocMoi}
                    onChange={(e) => setTenThuocMoi(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Giá bán (đ/kg)"
                    value={giaThuocMoi}
                    onChange={(e) => setGiaThuocMoi(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Tồn kho (gram)"
                    value={tonKhoMoi}
                    onChange={(e) => setTonKhoMoi(e.target.value)}
                />

                <button onClick={themThuocMoi}>➕ Thêm thuốc vào kho</button>

                <hr />

                <h2>Danh sách thuốc trong kho</h2>

                <div className="tim-kiem-kho">
                    <span className="tim-kiem-kho-icon">🔍</span>

                    <input
                        type="text"
                        placeholder="Tìm tên thuốc..."
                        value={tuKhoaKho}
                        onChange={(e) => setTuKhoaKho(e.target.value)}
                    />

                    {tuKhoaKho && (
                        <button className="tim-kiem-kho-xoa" onClick={() => setTuKhoaKho("")} title="Xóa tìm kiếm">
                            ✕
                        </button>
                    )}
                </div>

                <div className="bang-kho">
                    <div className="dong-kho tieu-de-kho">
                        <span>Tên thuốc</span>
                        <span>Giá/kg</span>
                        <span>Tồn kho</span>
                        <span>Thao tác</span>
                    </div>

                    {danhSachThuocTrongKho.map((thuoc) => (
                        <div key={thuoc.id} className="dong-kho">
                            {thuocDangSua?.id === thuoc.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={tenThuocSua}
                                        onChange={(e) => setTenThuocSua(e.target.value)}
                                    />

                                    <input
                                        type="number"
                                        value={giaThuocSua}
                                        onChange={(e) => setGiaThuocSua(e.target.value)}
                                    />

                                    <input
                                        type="number"
                                        value={tonKhoSua}
                                        onChange={(e) => setTonKhoSua(e.target.value)}
                                    />

                                    <div className="kho-thao-tac">
                                        <button className="btn-luu-thuoc" onClick={luuSuaThuoc}>
                                            💾
                                        </button>

                                        <button className="btn-huy-sua" onClick={huySuaThuoc}>
                                            ✖
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <strong>{thuoc.ten}</strong>

                                    <span>{thuoc.gia.toLocaleString("vi-VN")}đ</span>

                                    <span>{thuoc.tonKho.toLocaleString("vi-VN")}g</span>

                                    <div className="kho-thao-tac">
                                        <button
                                            className="btn-sua-thuoc"
                                            onClick={() => batDauSuaThuoc(thuoc)}
                                            title="Sửa thuốc"
                                        >
                                            ✏️
                                        </button>

                                        <button
                                            className="btn-xoa-thuoc"
                                            onClick={() => setThuocChoXoa(thuoc)}
                                            title="Xóa thuốc"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                <PopupXacNhan
                    mo={!!thuocChoXoa}
                    tieuDe="Xóa thuốc?"
                    noiDung={
                        <>
                            Anh có chắc muốn xóa <strong>“{thuocChoXoa?.ten}”</strong> khỏi kho không?
                        </>
                    }
                    chuNutXacNhan="🗑️ Xóa thuốc"
                    onHuy={() => setThuocChoXoa(null)}
                    onXacNhan={xoaThuocKho}
                />

                <button onClick={() => setTrang("trangchu")}>← Quay lại trang chủ</button>
            </div>
        </div>
    );
}

export default KhoThuoc;
