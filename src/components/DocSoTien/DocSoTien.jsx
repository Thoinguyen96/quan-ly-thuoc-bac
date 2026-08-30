const DocSoTien = ({ soTien }) => {
    const docSoTien = (so) => {
        if (!so || Number(so) === 0) return "Không đồng";

        const chuSo = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];

        const donVi = ["", "nghìn", "triệu", "tỷ"];

        const docBaSo = (num, dayDu = false) => {
            const tram = Math.floor(num / 100);
            const chuc = Math.floor((num % 100) / 10);
            const donViNho = num % 10;

            let ketQua = "";

            if (tram > 0) {
                ketQua += chuSo[tram] + " trăm";
            }

            if (chuc > 1) {
                ketQua += " " + chuSo[chuc] + " mươi";

                if (donViNho === 1) {
                    ketQua += " mốt";
                } else if (donViNho === 5) {
                    ketQua += " lăm";
                } else if (donViNho > 0) {
                    ketQua += " " + chuSo[donViNho];
                }
            } else if (chuc === 1) {
                ketQua += " mười";

                if (donViNho === 5) {
                    ketQua += " lăm";
                } else if (donViNho > 0) {
                    ketQua += " " + chuSo[donViNho];
                }
            } else if (donViNho > 0) {
                if (tram > 0) {
                    ketQua += " lẻ";
                }

                ketQua += " " + chuSo[donViNho];
            }

            return ketQua.trim();
        };

        let soTien = Math.floor(Number(so));
        let ketQua = "";
        let nhom = 0;

        while (soTien > 0) {
            const baSo = soTien % 1000;

            if (baSo > 0) {
                const phan = docBaSo(baSo);

                if (nhom > 0) {
                    ketQua = phan + " " + donVi[nhom] + " " + ketQua;
                } else {
                    ketQua = phan + " " + ketQua;
                }
            }

            soTien = Math.floor(soTien / 1000);
            nhom++;
        }

        ketQua = ketQua.trim().replace(/\s+/g, " ");

        return ketQua.charAt(0).toUpperCase() + ketQua.slice(1) + " đồng";
    };

    return <span className="bang-chu">Bằng chữ: {docSoTien(soTien)}</span>;
};

export default DocSoTien;
