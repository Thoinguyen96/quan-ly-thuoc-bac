import "./DangNhap.css";

function DangNhap({ tenDangNhap, setTenDangNhap, matKhau, setMatKhau, dangNhap, guiEmailDoiMatKhau }) {
    return (
        <div className="trang-dang-nhap">
            <div className="wrap_dangnhap">
                <h1>🔐 ĐĂNG NHẬP</h1>

                <div className="cang_ngang">
                    <input
                        type="text"
                        className="input_chuan"
                        placeholder="Tên đăng nhập"
                        value={tenDangNhap}
                        onChange={(e) => setTenDangNhap(e.target.value)}
                        autoComplete="username"
                    />

                    <input
                        className="input_chuan"
                        type="password"
                        placeholder="Mật khẩu"
                        value={matKhau}
                        onChange={(e) => setMatKhau(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                dangNhap();
                            }
                        }}
                    />
                </div>

                <button onClick={dangNhap}>🔑 Đăng nhập</button>

                <button type="button" className="btn-doi-mat-khau" onClick={guiEmailDoiMatKhau}>
                    Đổi mật khẩu
                </button>
            </div>
        </div>
    );
}

export default DangNhap;
