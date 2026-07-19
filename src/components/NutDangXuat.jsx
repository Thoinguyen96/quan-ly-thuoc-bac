import { supabase } from "../supabase";
import { toast } from "react-toastify";

function NutDangXuat({ setUser }) {
    const dangXuat = async () => {
        await supabase.auth.signOut();
        setUser(null);
        toast.success("Đã đăng xuất!");
    };

    return (
        <button className="nut-dang-xuat" onClick={dangXuat}>
            ↪ Đăng xuất
        </button>
    );
}

export default NutDangXuat;
