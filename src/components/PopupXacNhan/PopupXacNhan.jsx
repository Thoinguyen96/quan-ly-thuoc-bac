import "./PopupXacNhan.css";

function PopupXacNhan({ mo, tieuDe = "Xác nhận", noiDung, chuNutXacNhan = "Xác nhận", onHuy, onXacNhan }) {
    if (!mo) return null;

    return (
        <div className="popup-xac-nhan-overlay" onClick={onHuy}>
            <div className="popup-xac-nhan" onClick={(e) => e.stopPropagation()}>
                <div className="popup-xac-nhan-icon">⚠️</div>

                <h2>{tieuDe}</h2>

                <div className="popup-xac-nhan-noi-dung">{noiDung}</div>

                <div className="popup-xac-nhan-nut">
                    <button className="popup-nut-huy" onClick={onHuy}>
                        Hủy
                    </button>

                    <button className="popup-nut-dong-y" onClick={onXacNhan}>
                        {chuNutXacNhan}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PopupXacNhan;
