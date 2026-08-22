import "./TrangChu.css";

function TrangChu({ user }) {
    return (
        <div className="trang-chu">
            <div className="trang-chu-header">
                <div>
                    <h1>🌿 AN THỜI ĐƯỜNG</h1>
                    <p>Phòng Chẩn Trị Y Học Cổ Truyền</p>
                </div>

                <div className="trang-chu-welcome">
                    👋 Xin chào, <strong>{user?.ho_ten || "Bạn"}</strong>
                </div>
            </div>

            <div className="trang-chu-noi-dung">
                <div className="trang-chu-card">
                    <div className="card-icon">👥</div>
                    <div>
                        <span>Bệnh nhân</span>
                        <strong>128</strong>
                    </div>
                </div>

                <div className="trang-chu-card">
                    <div className="card-icon">💊</div>
                    <div>
                        <span>Thuốc trong kho</span>
                        <strong>86</strong>
                    </div>
                </div>

                <div className="trang-chu-card">
                    <div className="card-icon">📋</div>
                    <div>
                        <span>Toa thuốc</span>
                        <strong>24</strong>
                    </div>
                </div>

                <div className="trang-chu-card">
                    <div className="card-icon">💰</div>
                    <div>
                        <span>Doanh thu hôm nay</span>
                        <strong>2.450.000đ</strong>
                    </div>
                </div>
            </div>

            <div className="trang-chu-gioi-thieu">
                <h2>🌱 Chào mừng đến với hệ thống quản lý</h2>

                <p>
                    Quản lý thuốc, bệnh nhân, toa thuốc và hoạt động phòng chẩn trị một cách nhanh chóng và thuận tiện.
                </p>

                <div className="trang-chu-dich-vu">
                    <span>🌿 Châm cứu</span>
                    <span>🤲 Xoa bóp</span>
                    <span>👋 Bấm huyệt</span>
                    <span>💊 Bốc thuốc</span>
                </div>
            </div>
        </div>
    );
}

export default TrangChu;
