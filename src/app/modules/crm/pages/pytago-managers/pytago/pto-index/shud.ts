class Shud {
    calculate(input, userId, isLoggedIn = false) {
        const email = input?.email ?? '';
        const mobile = input?.mobile ?? '';
        const address = input?.address ?? '';
        let name = input?.name ?? '';
        const parentName = input?.parent_name ?? '';
        const date = input?.date ?? 0;
        const month = input?.month ?? 0;
        const year = input?.year ?? 0;
        const jsonResponse: any = {};

        jsonResponse.fullname = name.toLowerCase()
                                .split(' ')
                                .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                                .join(' ');
        jsonResponse.birthday = input?.birthday ?? '';
        jsonResponse.age = new Date().getFullYear() - year;
        jsonResponse.person_type = input?.person_type;
        jsonResponse.email = email;
        jsonResponse.mobile = mobile;
        jsonResponse.parent_name = parentName;
        jsonResponse.address = address;
        name = this.removeUnicode(name.toUpperCase());

        if (name !== '' && !isNaN(date) && !isNaN(month) && !isNaN(year)) {
            if (userId != 1) {
                if (mobile === '' || email === '') {
                    return false;
                }
            }

            // ---------- SAVE DATA TO DATABASE -----------
            //                      ???
            // ---------- SAVE DATA TO DATABASE -----------

            // ---------- TÍNH BIỂU ĐỒ HỌ TÊN -------------
            const bieuDoHoTen = ['', '', '', '', '', '', '', '', '', ''];
            const mapHoTen = this.text2Num(name);
            const arrHoten = mapHoTen.toString().split('');

            for (const item of arrHoten) {
                bieuDoHoTen[item] += item;
            }
            // ---------- TÍNH BIỂU ĐỒ HỌ TÊN -------------

            // -----------SỐ ĐƯỜNG ĐỜI 1-9, 11, 22-----------
            const tong = this.calShortNumber(date, 'one2nine') +
                this.calShortNumber(month, 'one2nine') +
                this.calShortNumber(year, 'one2nine');
            const soDuongDoi = this.calShortNumber(tong);
            // -----------SỐ ĐƯỜNG ĐỜI-----------

            // -----------SỐ NGÀY SINH-----------
            const soNgaySinh = this.calShortNumber(date, 'one2nine');
            // -----------SỐ NGÀY SINH-----------

            // -----------SỨ MỆNH-----------
            const nameMapped = this.text2Num(name);
            const suMenh = this.calShortNumber(nameMapped, 'one2nine');
            // -----------SỨ MỆNH-----------

            // -----------TƯƠNG TÁC-----------
            const nameNoVowel = this.removeVowels(name);
            const nameMappedNoVowel = this.text2Num(nameNoVowel);
            const tuongTac = this.calShortNumber(nameMappedNoVowel, 'one2nine');
            // -----------TƯƠNG TÁC-----------

            // ----------- CHẶNG ĐƯỜNG ĐỜI (4 NĂM ĐỈNH CAO) -----------
            const thang = this.calShortNumber(month, 'one2nine');
            const ngay = this.calShortNumber(date, 'one2nine');
            const nam = this.calShortNumber(year, 'one2nine');

            var soDuongDoiNew = soDuongDoi;
            if (soDuongDoi == 11) {
                soDuongDoiNew = 2;
            } else if (soDuongDoi == 22) {
                soDuongDoiNew = 4;
            } else if (soDuongDoi == 33) {
                soDuongDoiNew = 6;
            }

            const tuoiDinh1 = 36 - soDuongDoiNew;
            const tuoiDinh2 = tuoiDinh1 + 9;
            const tuoiDinh3 = tuoiDinh2 + 9;
            const tuoiDinh4 = tuoiDinh3 + 9;

            const dinh1 = this.calShortNumber(thang + ngay);
            const dinh2 = this.calShortNumber(ngay + nam);
            const dinh3 = this.calShortNumber(dinh1 + dinh2);
            const dinh4 = this.calShortNumber(thang + nam);
            // ----------- CHẶNG ĐƯỜNG ĐỜI (4 NĂM ĐỈNH CAO) -----------

            // ----------- NĂM CÁ NHÂN -----------
            const currentYear = new Date().getFullYear();
            const tongCanhan = this.calShortNumber(date, 'one2nine') +
                this.calShortNumber(month, 'one2nine') +
                this.calShortNumber(currentYear, 'one2nine');
            // ----------- NĂM CÁ NHÂN -----------

            // ----------- THÁI ĐỘ -----------
            const tongThaido = this.calShortNumber(date, 'one2nine') +
                this.calShortNumber(month, 'one2nine');
            const thaiDo = this.calShortNumber(tongThaido, 'one2nine');
            // ----------- THÁI ĐỘ -----------

            // ----------- BIỂU ĐỒ MŨI TÊN -----------
            const bieuDoNgaySinh = ['', '', '', '', '', '', '', '', '', ''];
            const arrDMY = (date.toString() + month.toString() + year.toString()).split('');

            for (const item of arrDMY) {
                bieuDoNgaySinh[item] += item;
            }
            // ----------- BIỂU ĐỒ MŨI TÊN -----------

            // -----------NỘI TÂM-----------
            const nameNoConstants = this.removeConstants(name);
            const nameMappedConstants = this.text2Num(nameNoConstants);
            const noiTam = this.calShortNumber(nameMappedConstants, 'one2nine');
            // -----------NỘI TÂM-----------

            // -----------SỐ LẶP-----------
            const splitSixMainIndex = (suMenh.toString() + this.calShortNumber(soDuongDoi, 'one2nine').toString()
              + thaiDo.toString() + tuongTac.toString() + soNgaySinh.toString() + noiTam.toString()).split('');
            const arrLoop = ['', '', '', '', '', '', '', '', '', ''];
            for (const item of splitSixMainIndex) {
                arrLoop[item] += item;
            }
            const solap = [];
            for (let j = 1; j < arrLoop.length; j++) {
                if (arrLoop[j].length > 1) {
                    solap.push(j);
                }
            }
            // -----------SỐ LẶP-----------

            // -----------SỐ CÂN BẰNG-----------
            const matches = name.match(/\b(\w)/g);
            const firstLetter = matches.join('');
            const mapSoCanBang = this.text2Num(firstLetter);
            // -----------SỐ CÂN BẰNG-----------

            // -----------SỐ BỔ SUNG-----------
            const soBoSung = [];
            for (let i = 1; i < bieuDoHoTen.length; i++) {
                if (bieuDoHoTen[i] === '') {
                    soBoSung.push(i);
                }
            }
            // -----------SỐ BỔ SUNG-----------

            // -----------NỘI CẢM-----------
            const noiCam = [];
            let maxLength = 0;
            for (let j = 1; j < bieuDoHoTen.length; j++) {
                if (bieuDoHoTen[j].length > maxLength) {
                    maxLength = bieuDoHoTen[j].length;
                }
            }
            for (let j = 1; j < bieuDoHoTen.length; j++) {
                if (bieuDoHoTen[j].length === maxLength) {
                    noiCam.push(j);
                }
            }
            // -----------NỘI CẢM-----------
            // -----------TRẢI NGHIỆM-----------
            const aNameEn = name.split('');
            let sTraiNghiem = '';
            for (const item of aNameEn) {
                if (['E', 'W', 'D', 'M'].includes(item)) {
                    sTraiNghiem += item;
                }
            }
            const mapTrainghiem = this.text2Num(sTraiNghiem);
            const trainghiem = this.calShortNumber(mapTrainghiem, 'one2nine');
            // -----------TRẢI NGHIỆM-----------

            // -----------TRỰC GIÁC-----------
            let sTrucGiac = '';
            for (const item of aNameEn) {
                if (['K', 'F', 'Q', 'U', 'Y', 'C', 'V'].includes(item)) {
                    sTrucGiac += item;
                }
            }
            const mapTrucgiac = this.text2Num(sTrucGiac);
            const trucgiac = this.calShortNumber(mapTrucgiac, 'one2nine');
            // -----------TRỰC GIÁC-----------

            // -----------CẢM XÚC-----------
            let sCamXuc = '';
            for (const item of aNameEn) {
                if (['I', 'O', 'R', 'Z', 'B', 'S', 'T', 'X'].includes(item)) {
                    sCamXuc += item;
                }
            }
            const mapCamxuc = this.text2Num(sCamXuc);
            const camxuc = this.calShortNumber(mapCamxuc, 'one2nine');
            // -----------CẢM XÚC-----------

            // -----------LOGIC-----------
            let sLogic = '';
            for (const item of aNameEn) {
                if (['A', 'H', 'J', 'N', 'P', 'G', 'L'].includes(item)) {
                    sLogic += item;
                }
            }
            const mapLogic = this.text2Num(sLogic);
            const logic = this.calShortNumber(mapLogic, 'one2nine');
            // -----------LOGIC-----------

            // -----------THỬ THÁCH-----------
            const thuthach1 = Math.abs(ngay - thang);
            const thuthach2 = Math.abs(ngay - nam);
            const thuthach3 = Math.abs(thuthach1 - thuthach2);
            const thuthach4 = Math.abs(thang - nam);
            // -----------THỬ THÁCH-----------


            jsonResponse.HK_su_menh = suMenh;
            jsonResponse.HK_noi_tam = noiTam;
            jsonResponse.HK_duong_doi = soDuongDoi;
            jsonResponse.HK_ngay_sinh = soNgaySinh;
            jsonResponse.HK_tuong_tac = tuongTac;
            jsonResponse.HK_thai_do = thaiDo;
            if (isLoggedIn) {
                jsonResponse.HK_bieu_do_ho_ten = bieuDoHoTen;
                jsonResponse.HK_tuoi_dinh_1 = tuoiDinh1;
                jsonResponse.HK_tuoi_dinh_2 = tuoiDinh2;
                jsonResponse.HK_tuoi_dinh_3 = tuoiDinh3;
                jsonResponse.HK_tuoi_dinh_4 = tuoiDinh4;
                jsonResponse.dinh1 = dinh1;
                jsonResponse.dinh2 = dinh2;
                jsonResponse.dinh3 = dinh3;
                jsonResponse.dinh4 = dinh4;
                jsonResponse.HK_4_dinh_cao_cuoc_doi = [dinh1, dinh2, dinh3, dinh4];
                jsonResponse.HK_nam_ca_nhan = this.calShortNumber(tongCanhan, 'one2nine');
                jsonResponse.HK_bieu_do_ngay_sinh = bieuDoNgaySinh;
                jsonResponse.HK_so_lap = solap;
                // -----------SỐ KẾT NỐI SỨ MỆNH & ĐƯỜNG ĐỜI-----------
                jsonResponse.HK_ket_noi_duong_doi_va_su_menh = Math.abs(
                    this.calShortNumber(suMenh, 'one2nine') -
                    this.calShortNumber(soDuongDoi, 'one2nine')
                );
                // -----------TRƯỞNG THÀNH-----------
                jsonResponse.HK_truong_thanh = this.calShortNumber(
                    (this.calShortNumber(suMenh, 'one2nine') + this.calShortNumber(soDuongDoi, 'one2nine')),
                    'one2nine'
                );
                jsonResponse.HK_can_bang = this.calShortNumber(mapSoCanBang, 'one2nine');
                jsonResponse.HK_bo_sung = soBoSung;
                jsonResponse.HK_ket_noi_noi_tam_va_tuong_tac = Math.abs(noiTam - tuongTac);
                jsonResponse.HK_noi_cam = noiCam;
                jsonResponse.HK_trai_nghiem = trainghiem == 0 ? 1 : trainghiem;
                jsonResponse.HK_truc_giac = trucgiac == 0 ? 1 : trucgiac;
                jsonResponse.HK_cam_xuc = camxuc == 0 ? 1 : camxuc;
                jsonResponse.HK_logic = logic == 0 ? 1 : logic;
                jsonResponse.HK_thach_thuc = [thuthach1, thuthach2, thuthach3, thuthach4];
            }
        }


        return jsonResponse;
    }

    calShortNumber(number, type = 'all') {
        if ( type === 'all' && (number === 11 || number === 22)) {
            return number;
        }else {
            const arrNum = number.toString().split('');
            if (arrNum.length > 1) {
                return this.calShortNumber(arrNum.reduce((a, b) => parseInt(a) + parseInt(b)), type);
            } else {
                return number;
            }
        }
    }

    text2Num(str, type = 'convert') {
        const sample = [];
        sample[0] = [];
        sample.push(['A', 'J', 'S']);
        sample.push(['B', 'K', 'T']);
        sample.push(['C', 'L', 'U']);
        sample.push(['D', 'M', 'V']);
        sample.push(['E', 'N', 'W']);
        sample.push(['F', 'O', 'X']);
        sample.push(['G', 'P', 'Y']);
        sample.push(['H', 'Q', 'Z']);
        sample.push(['I', 'R']);

        const enStr = this.removeUnicode(str);
        enStr.replaceAll(' ', '');
        const arrStr = enStr.split('');
        const arrLength = arrStr.length;

        let mapNum = 0;
        let textAfterConvert = '';
        for (let i = 0; i < arrLength; i++) {
            for (let num = 0; num < sample.length; num++) {
                if (sample[num].includes(arrStr[i])) {
                    mapNum = mapNum + parseInt(num.toString());
                    textAfterConvert += num;
                    break;
                }
            }
        }

        return type === 'convert' ? textAfterConvert : mapNum;
    }

    removeVowels(str) {
        // return str.replace(/[aeiou]/gi, '');
        let strFin = '';
        let pos = 0;
        const arrVowels = ['A', 'E', 'I', 'O', 'U'];
        const splitStr = str.split(' ');
        for (let i = 0; i < splitStr.length; i++) {
            pos = splitStr[i].indexOf('Y');
            if (pos !== -1) {
                const tmp = splitStr[i].split('');
                if (
                    (tmp[pos - 1] && arrVowels.includes(tmp[pos - 1])) ||
                    (tmp[pos + 1] && arrVowels.includes(tmp[pos + 1]))
                ) {
                    strFin += splitStr[i].replace(/[aeiou]/gi, '');
                }else {
                    strFin += splitStr[i].replace(/[aeiouy]/gi, '');
                }
            }else {
                strFin += splitStr[i].replace(/[aeiou]/gi, '');
            }
        }
        return strFin;
    }

    removeConstants(str) {
        let strFin = '';
        let pos = 0;
        const arrVowels = ['A', 'E', 'I', 'O', 'U'];
        const splitStr = str.split(' ');
        for (let i = 0; i < splitStr.length; i++) {
            pos = splitStr[i].indexOf('Y');
            if (pos !== -1) {
                const tmp = splitStr[i].split('');
                if (
                    (tmp[pos - 1] && arrVowels.includes(tmp[pos - 1])) ||
                    (tmp[pos + 1] && arrVowels.includes(tmp[pos + 1]))
                ) {
                    strFin += splitStr[i].replace(/[bcdfghjklmnpqrstvwxyz]/gi, '');
                }else {
                    strFin += splitStr[i].replace(/[bcdfghjklmnpqrstvwxz]/gi, '');
                }
            }else {
                strFin += splitStr[i].replace(/[bcdfghjklmnpqrstvwxyz]/gi, '');
            }
        }
        return strFin;
    }

    removeUnicode(str) {
        str = str.replace(/\s+/g, ' ');
        str.trim();
        str = str.replace(/[^0-9a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]/gi, '');

        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
        str = str.replace(/đ/g, 'd');
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
        str = str.replace(/Đ/g, 'D');

        return str;
    }

}

export default new Shud();
