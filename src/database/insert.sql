INSERT INTO LOAI_THANH_VIEN (MA_LOAI, TEN_LOAI, NGUONG_DIEM) VALUES
('LTV01', 'Đồng', 0),
('LTV02', 'Bạc', 5000),
('LTV03', 'Vàng', 10000);

INSERT INTO HANG_VE (MA_HANGVE, TEN_HANGVE) VALUES
('ECO', 'Phổ thông'),
('BUS', 'Thương gia');

INSERT INTO KHUYEN_MAI (MAKM, TIEU_DE, NOI_DUNG, NGAY_BAT_DAU, NGAY_KET_THUC, DOI_TUONG_AP_DUNG) VALUES
('KMHE25', 'Khuyến mãi Chào Hè 2025', 'Giảm giá 15% cho tất cả các chuyến bay nội địa.', '2025-06-01', '2025-08-31', 'Tất cả thành viên'),
('KMT9', 'Rộn ràng tựu trường', 'Giảm 100,000 VND cho các đơn hàng từ 1,500,000 VND.', '2025-09-01', '2025-09-30', 'Thành viên Bạc');

INSERT INTO KHACH_HANG (MAKH, HO_TEN, NGAY_SINH, GIOI_TINH, EMAIL, SDT, MAT_KHAU, MA_LOAI) VALUES
('KH001', 'Nguyễn Châu Anh Kiệt', '1990-01-15', 'M', 'kiet.nguyen@email.com', '0901234567', 'password_string_1', 'LTV01'),
('KH002', 'Lâm Hồng Lam', '1995-05-20', 'F', 'hong.lam@email.com', '0987654321', 'password_string_2', 'LTV01');

INSERT INTO CHUYEN_BAY (MACHUYEN, SAN_BAY_DI, SAN_BAY_DEN, GIO_DI, GIO_DEN, SO_HIEU_CHUYEN_BAY, HANG_HANG_KHONG, TRANG_THAI) VALUES
('CB001', 'Tân Sơn Nhất (SGN)', 'Nội Bài (HAN)', '2025-08-10 08:00:00', '2025-08-10 10:05:00', 'VN244', 'Vietnam Airlines', 'Đúng giờ'),
('CB002', 'Nội Bài (HAN)', 'Đà Nẵng (DAD)', '2025-08-11 14:30:00', '2025-08-11 15:50:00', 'VJ161', 'VietJet Air', 'Đúng giờ');

INSERT INTO DAT_VE (MADATVE, MAKH, MACHUYEN, NGAY_DAT, TONG_TIEN, TRANG_THAI) VALUES
('DV001', 'KH001', 'CB001', '2025-07-10 19:30:00', 3000000.00, 'Đã thanh toán'),
('DV002', 'KH002', 'CB002', '2025-07-11 10:15:00', 1250000.00, 'Chờ thanh toán');

INSERT INTO VE_CHI_TIET (MAVE, MADATVE, HO_TEN_HANH_KHACH, SO_GHE, MA_HANGVE, GIA_VE, DICH_VU_BO_SUNG) VALUES
('VE001', 'DV001', 'Nguyễn Văn An', '25A', 'BUS', 3000000.00, 'Suất ăn đặc biệt'),
('VE002', 'DV002', 'Trần Thị Bích', '18C', 'ECO', 1250000.00, NULL);

INSERT INTO HOA_DON (MAHD, MADATVE, NGAY_LAP, TONG_TIEN, TRANG_THAI) VALUES
('HD001', 'DV001', '2025-07-10', 3000000.00, 'Đã thanh toán');

INSERT INTO TICH_DIEM (MA_TD, MAKH, NGUON_TICH_DIEM, DIEM) VALUES
('TD001', 'KH001', 'Hoàn tất chuyến bay CB001', 300),
('TD002', 'KH001', 'Đánh giá ứng dụng', 50);

INSERT INTO TONG_DIEM (MAKH, TONG_DIEM, MA_LOAI) VALUES
('KH001', 350, 'LTV01'),
('KH002', 0, 'LTV01');

INSERT INTO THONG_BAO (MATHONGBAO, MAKH, NOI_DUNG, NGAY_GUI, LOAI_THONG_BAO) VALUES
('TB001', 'KH001', 'Cảm ơn bạn đã đặt vé cho chuyến bay VN244. Chúc bạn có một chuyến đi vui vẻ!', '2025-07-10 19:35:00', 'Xác nhận đặt vé'),
('TB002', 'KH002', 'Đơn đặt vé DV002 của bạn sẽ hết hạn thanh toán trong 24 giờ. Vui lòng hoàn tất để giữ chỗ.', '2025-07-11 10:20:00', 'Nhắc nhở thanh toán');

INSERT INTO GIA_VE_THEO_HANG (MACHUYEN, MA_HANGVE, GIA) VALUES
('CB001', 'ECO', 1500000.00), -- Giá Phổ thông cho chuyến bay CB001
('CB001', 'BUS', 3500000.00), -- Giá Thương gia cho chuyến bay CB001
('CB002', 'ECO', 1200000.00); -- Giá Phổ thông cho chuyến bay CB002
