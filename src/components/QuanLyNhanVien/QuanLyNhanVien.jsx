import TaoNhanVien from "../TaoNhanVien/TaoNhanVien";
import "./QuanLyNhanVien.css";
function QuanLyNhanVien({ user, setTrang, coQuyen, taiDanhSachNhanVien }) {
    return (
        <div className="container">
            <button onClick={() => setTrang("trangchu")}>← Quay lại</button>

            <TaoNhanVien />

            <button
                type="button"
                onClick={async () => {
                    await taiDanhSachNhanVien();
                    setTrang("danhsachnhanvien");
                }}
            >
                📄 Danh sách tài khoản nhân viên
            </button>
        </div>
    );
}

export default QuanLyNhanVien;
