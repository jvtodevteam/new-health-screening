import React, { useState, useEffect,useRef } from "react";
import { Head } from '@inertiajs/react';
import {
    MapPin,
    Calendar,
    Clock,
    User,
    Heart,
    Activity,
    TrendingUp,
    Home,
    Map,
    FileText,
    Settings,
    LogOut,
    Plus,
    ChevronRight,
    ArrowLeft,
    CloudSun,
    X,
    CheckCircle,
    AlertCircle,
    DollarSign,
    Mail,
    Search,
    Upload,
    Download,
    Eye,
    Thermometer,
    Wind,
    Droplets,
    Footprints,
    Flashlight,
    Umbrella,
    Globe,
    Sunrise,
    Sunset
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const App = () => {
    const [currentScreen, setCurrentScreen] = useState("onboarding"); // login, home, screening, location, profile, form1, form2, form3, form4, form5, form6, partner, details, receipt, viewTicket
    const [language, setLanguage] = useState("en");
    const [activeTab, setActiveTab] = useState("pending");
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("bank");
    const [selectedDate, setSelectedDate] = useState(15);
    const [selectedTime, setSelectedTime] = useState("morning");
    const [participants, setParticipants] = useState([
        {
            title: "Mr",
            name: "",
            age: "",
            nationality: "",
            hasMedicalHistory: false,
            allergies: "",
            pastMedicalHistory: "",
            currentMedications: "",
            familyMedicalHistory: "",
        },
    ]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [selectedLocationFromMap, setSelectedLocationFromMap] =
        useState(null);
    const [showVideoPopup, setShowVideoPopup] = useState(false);
    const [screeningData, setScreeningData] = useState([]);
    const [selectedScreeningId, setSelectedScreeningId] = useState(null);


    const texts = {
        en: {
            // Existing translations
            login: "Login",
            email: "Email",
            password: "Password",
            loginWithGoogle: "Login with Google",
            loginWithEmail: "Login with Email",
            hello: "Hello",
            weather: "Ijen Weather Forecast",
            healthScreening: "Health Screening",
            history: "Submission History",
            track: "Ijen Track Map",
            prepare: "What to Prepare",
            partner: "Become a Partner",
            pending: "Pending",
            complete: "Complete",
            location: "Location",
            date : "Date",
            time: "Time",
            profile: "Profile",
            privacy: "Privacy Policy",
            terms: "Terms and Conditions",
            logout: "Logout",
            selectLocation: "Select Location",
            yourData: "Your Data",
            name: "Name",
            age: "Age",
            nationality: "Nationality",
            medicalHistory: "Medical History",
            allergies: "Allergies",
            pastMedical: "Past Medical History",
            currentMeds: "Current Medications",
            familyMedical: "Family Medical History",
            summary: "Summary",
            total: "Total",
            payment: "Payment Options",
            submit: "Submit",
            next: "Next",
            addParticipant: "Add Participant",

            // New translations for static text
            appName: "Ijen Health App",
            appTagline: "Health screening for your safe journey",
            continueAgreement: "By continuing, you agree to our",
            loginToContinue: "Login to continue",
            completeCheck: "Complete your health check",
            healthStatus: "Health status: Complete your check",
            startHealthCheck: "Start Health Check",
            recentSubmissions: "Recent Submissions",
            pendingCount: "1 Pending",
            viewDetails: "View Details",
            exploreRoutes: "Explore Ijen Crater Routes",
            interactiveMap: "Interactive Map",
            routeDescription:
                "Find the best route for your journey with our detailed maps",
            viewFullMap: "View Full Map",
            becomePartnerTitle: "Become A Partner",
            reviewInfo: "Review Your Information",
            screeningDetails: "Screening Details",
            screeningSubmitted: "Screening Submitted",
            completePayment:
                "Please complete the payment to finalize your screening",
            paymentDetails: "Payment Details",
            bankTransferInstructions: "Bank Transfer Instructions",
            transferAmount: "Transfer the exact amount shown below",
            includeReference: "Include the reference ID in the transfer notes",
            completeWithin: "Complete payment within 24 hours",
            uploadReceipt: "Upload your payment receipt",
            continueToPayment: "Continue to Payment",
            confirmPayment: "Confirm Payment",
            proceedToPayment: "Proceed to Payment",
            backToHome: "Back to Home",
            ijenCraterExperience: "Ijen Crater Experience",
            becomePartnerText: "Become A Partner",
            registerLocation: "Register your health screening location",
            submitApplication: "Submit Application",
            businessName: "Business Name",
            businessType: "Business Type",
            contactPerson: "Contact Person",
            emailAddress: "Email Address",
            phoneNumber: "Phone Number",
            businessAddress: "Business Address",
            whyPartner: "Why do you want to become a partner?",
            businessLicense: "Business License",
            eTicket: "E-Ticket",
            eTicketSubtitle: "E-Ticket for Health Check",
            healthPass: "Ijen Health Pass",
            healthConfirmation: "Health Screening Confirmation",
            referenceId: "Reference ID",
            participants: "Participants",
            arriveEarly:
                "Please arrive 15 minutes before your scheduled time for check-in",
            showTicket:
                "Health screening confirmed. Please show this e-ticket upon arrival.",
            issuedBy: "Issued by",
            status: "Status",
            confirmed: "CONFIRMED",
            issuingOrg: "Ijen Health Services",
            viewETicket: "View E-Ticket",
            paymentSuccessful: "Payment Successful!",
            healthConfirmed: "Your health screening has been confirmed",
            amount: "Amount",
            account: "Account",
            accountNumber: "Account Number",
            accountName: "Account Name",
            copy: "Copy",
            processing: "Processing...",
            applicationSubmitted: "Application Submitted!",
            review: "Review",
            locationDetails: "Location Details",
            selectedLocation: "Selected Location",
            selectDateAndTime: "Select Date & Time",
            navHome: "Home",
            navScreening: "Screening",
            navLocation: "Location",
            navProfile: "Profile",
            bondowoso: "Bondowoso",
            banyuwangi: "Banyuwangi",
            selectCity: "Select a City",
            selectCityPrompt:
                "Please choose a city from the tabs above to view available locations",
            searchLocations: "Search locations...",
            elevation: "Elevation",
            difficulty: "Difficulty",
            facilities: "Facilities",
            selectThisLocation: "Select This Location",
            confirmationTitle: "Confirmation",
            language: "Language",
            partnerDescription:
                "Our partner program connects verified health screening providers with travelers to Ijen. Join our network to offer essential pre-trek health checks.",
            uploadDocuments: "Upload Required Documents",
            uploadInstructions: "Click to upload or drag and drop",
            fileTypes: "PDF, PNG, JPG up to 5MB",
            requiredField: "*",
            reviewApplication:
                "Please review your information before submitting. After submission, our team will review your application within 3-5 business days.",
            participantInfo: "Participant Information",
            title: "Title",
            warmClothing: "Warm Clothing",
            warmClothingDesc:
                "Temperature can drop to 2°C at night. Bring layers including a jacket and thermal wear.",
            gasMask: "Gas Mask",
            gasMaskDesc:
                "Protect yourself from sulfur gas. Rentals are available, but bringing your own is recommended.",
            waterSnacks: "Water & Snacks",
            waterSnacksDesc:
                "Stay hydrated and energized. Bring at least 1.5 liters of water per person.",
            properFootwear: "Proper Footwear",
            footwearDesc:
                "Sturdy hiking boots with good ankle support. The terrain is rocky and can be slippery.",
            headlamp: "Headlamp",
            headlampDesc:
                "Essential for night hikes to see the blue fire. Hands-free lighting is important for safety.",
            rainGear: "Rain Gear",
            rainGearDesc:
                "Weather can change quickly. Bring a lightweight waterproof jacket or poncho.",
            essentialItems: "Essential Items",
            bankTransfer: "Bank Transfer",
            manualVerification: "Manual verification (1-2 hours)",
            creditDebitCard: "Credit/Debit Card",
            instantVerification: "Instant verification",
            eWallet: "E-Wallet",
            screeningFee: "Screening Fee",
            serviceFee: "Service Fee",
            pinLocation: "Pin Your Location",
            selectMapLocation: "Click to select your location on map",
            partnerInterest:
                "Tell us about your interest in partnering with Ijen Health",
            businessDetails: "Business Details",
            locationDocuments: "Location & Documents",
            progress: "Progress",
        },
        id: {
            // Existing translations
            login: "Masuk",
            email: "Email",
            password: "Kata Sandi",
            loginWithGoogle: "Masuk dengan Google",
            loginWithEmail: "Masuk dengan Email",
            hello: "Halo",
            weather: "Prakiraan Cuaca Ijen",
            healthScreening: "Pemeriksaan Kesehatan",
            history: "Riwayat Pengajuan",
            track: "Peta Jalur Ijen",
            prepare: "Apa yang Harus Disiapkan",
            partner: "Menjadi Mitra",
            pending: "Tertunda",
            complete: "Selesai",
            location: "Lokasi",
            date : "Tanggal",
            time: "Waktu",
            profile: "Profil",
            privacy: "Kebijakan Privasi",
            terms: "Syarat dan Ketentuan",
            logout: "Keluar",
            selectLocation: "Pilih Lokasi",
            yourData: "Data Anda",
            name: "Nama",
            age: "Usia",
            nationality: "Kewarganegaraan",
            medicalHistory: "Riwayat Kesehatan",
            allergies: "Alergi",
            pastMedical: "Riwayat Medis",
            currentMeds: "Obat yang Sedang Dikonsumsi",
            familyMedical: "Riwayat Kesehatan Keluarga",
            summary: "Ringkasan",
            total: "Total",
            payment: "Pilihan Pembayaran",
            submit: "Kirim",
            next: "Selanjutnya",
            addParticipant: "Tambah Peserta",

            // New translations for static text
            appName: "Ijen Health",
            appTagline: "Pemeriksaan kesehatan untuk perjalanan aman Anda",
            continueAgreement: "Dengan melanjutkan, Anda menyetujui",
            loginToContinue: "Masuk untuk melanjutkan",
            completeCheck: "Lengkapi pemeriksaan kesehatan Anda",
            healthStatus: "Status kesehatan: Lengkapi pemeriksaan Anda",
            startHealthCheck: "Mulai Pemeriksaan Kesehatan",
            recentSubmissions: "Pengajuan Terbaru",
            pendingCount: "1 Tertunda",
            viewDetails: "Lihat Detail",
            exploreRoutes: "Jelajahi Rute Kawah Ijen",
            interactiveMap: "Peta Interaktif",
            routeDescription:
                "Temukan rute terbaik untuk perjalanan Anda dengan peta detail kami",
            viewFullMap: "Lihat Peta Lengkap",
            becomePartnerTitle: "Menjadi Mitra",
            reviewInfo: "Tinjau Informasi Anda",
            screeningDetails: "Detail Pemeriksaan",
            screeningSubmitted: "Pemeriksaan Terkirim",
            completePayment:
                "Silakan selesaikan pembayaran untuk menyelesaikan pemeriksaan Anda",
            paymentDetails: "Detail Pembayaran",
            bankTransferInstructions: "Petunjuk Transfer Bank",
            transferAmount: "Transfer jumlah yang ditampilkan di bawah ini",
            includeReference: "Sertakan ID referensi dalam catatan transfer",
            completeWithin: "Selesaikan pembayaran dalam 24 jam",
            uploadReceipt: "Unggah bukti pembayaran Anda",
            continueToPayment: "Lanjutkan ke Pembayaran",
            confirmPayment: "Konfirmasi Pembayaran",
            proceedToPayment: "Lanjut ke Pembayaran",
            backToHome: "Kembali ke Beranda",
            ijenCraterExperience: "Pengalaman Kawah Ijen",
            becomePartnerText: "Menjadi Mitra",
            registerLocation: "Daftarkan lokasi pemeriksaan kesehatan Anda",
            submitApplication: "Kirim Aplikasi",
            businessName: "Nama Bisnis",
            businessType: "Jenis Bisnis",
            contactPerson: "Narahubung",
            emailAddress: "Alamat Email",
            phoneNumber: "Nomor Telepon",
            businessAddress: "Alamat Bisnis",
            whyPartner: "Mengapa Anda ingin menjadi mitra?",
            businessLicense: "Izin Usaha",
            eTicket: "E-Tiket",
            eTicketSubtitle: "E-Tiket untuk Pemeriksaan Kesehatan",
            healthPass: "Pas Kesehatan Ijen",
            healthConfirmation: "Konfirmasi Pemeriksaan Kesehatan",
            referenceId: "ID Referensi",
            participants: "Peserta",
            arriveEarly:
                "Harap tiba 15 menit sebelum waktu yang dijadwalkan untuk check-in",
            showTicket:
                "Pemeriksaan kesehatan dikonfirmasi. Harap tunjukkan e-tiket ini saat kedatangan.",
            issuedBy: "Diterbitkan oleh",
            status: "Status",
            confirmed: "DIKONFIRMASI",
            issuingOrg: "Layanan Kesehatan Ijen",
            viewETicket: "Lihat E-Tiket",
            paymentSuccessful: "Pembayaran Berhasil!",
            healthConfirmed: "Pemeriksaan kesehatan Anda telah dikonfirmasi",
            amount: "Jumlah",
            account: "Akun",
            accountNumber: "Nomor Rekening",
            accountName: "Nama Rekening",
            copy: "Salin",
            processing: "Memproses...",
            applicationSubmitted: "Aplikasi Terkirim!",
            review: "Tinjauan",
            locationDetails: "Detail Lokasi",
            selectedLocation: "Lokasi yang Dipilih",
            selectDateAndTime: "Pilih Tanggal & Waktu",
            navHome: "Beranda",
            navScreening: "Pemeriksaan",
            navLocation: "Lokasi",
            navProfile: "Profil",
            bondowoso: "Bondowoso",
            banyuwangi: "Banyuwangi",
            selectCity: "Pilih Kota",
            selectCityPrompt:
                "Silakan pilih kota dari tab di atas untuk melihat lokasi yang tersedia",
            searchLocations: "Cari lokasi...",
            elevation: "Ketinggian",
            difficulty: "Tingkat Kesulitan",
            facilities: "Fasilitas",
            selectThisLocation: "Pilih Lokasi Ini",
            confirmationTitle: "Konfirmasi",
            language: "Bahasa",
            partnerDescription:
                "Program mitra kami menghubungkan penyedia pemeriksaan kesehatan terverifikasi dengan pelancong ke Ijen. Bergabunglah dengan jaringan kami untuk menawarkan pemeriksaan kesehatan pra-pendakian yang penting.",
            uploadDocuments: "Unggah Dokumen yang Diperlukan",
            uploadInstructions: "Klik untuk mengunggah atau seret dan lepas",
            fileTypes: "PDF, PNG, JPG hingga 5MB",
            requiredField: "*",
            reviewApplication:
                "Harap tinjau informasi Anda sebelum mengirim. Setelah pengiriman, tim kami akan meninjau aplikasi Anda dalam 3-5 hari kerja.",
            participantInfo: "Informasi Peserta",
            title: "Gelar",
            warmClothing: "Pakaian Hangat",
            warmClothingDesc:
                "Suhu dapat turun hingga 2°C di malam hari. Bawa lapisan termasuk jaket dan pakaian termal.",
            gasMask: "Masker Gas",
            gasMaskDesc:
                "Lindungi diri dari gas belerang. Persewaan tersedia, tetapi membawa sendiri direkomendasikan.",
            waterSnacks: "Air & Makanan Ringan",
            waterSnacksDesc:
                "Tetap terhidrasi dan berenergi. Bawa setidaknya 1,5 liter air per orang.",
            properFootwear: "Alas Kaki yang Tepat",
            footwearDesc:
                "Sepatu hiking yang kokoh dengan dukungan pergelangan kaki. Medan berbatu dan bisa licin.",
            headlamp: "Lampu Kepala",
            headlampDesc:
                "Penting untuk pendakian malam untuk melihat api biru. Pencahayaan hands-free penting untuk keselamatan.",
            rainGear: "Perlengkapan Hujan",
            rainGearDesc:
                "Cuaca dapat berubah dengan cepat. Bawa jaket tahan air ringan atau jas hujan.",
            essentialItems: "Perlengkapan Penting",
            bankTransfer: "Transfer Bank",
            manualVerification: "Verifikasi manual (1-2 jam)",
            creditDebitCard: "Kartu Kredit/Debit",
            instantVerification: "Verifikasi instan",
            eWallet: "E-Wallet",
            screeningFee: "Biaya Pemeriksaan",
            serviceFee: "Biaya Layanan",
            pinLocation: "Pin Lokasi Anda",
            selectMapLocation: "Klik untuk memilih lokasi Anda di peta",
            partnerInterest:
                "Ceritakan tentang minat Anda dalam bermitra dengan Ijen Health",
            businessDetails: "Detail Bisnis",
            locationDocuments: "Lokasi & Dokumen",
            progress: "Kemajuan",
        },
        zh: {
            // Existing translations
            login: "登录",
            email: "电子邮件",
            password: "密码",
            loginWithGoogle: "使用谷歌账号登录",
            loginWithEmail: "使用电子邮件登录",
            hello: "您好",
            weather: "伊真火山天气预报",
            healthScreening: "健康检查",
            history: "提交历史",
            track: "伊真火山路线图",
            prepare: "需要准备的物品",
            partner: "成为合作伙伴",
            pending: "待处理",
            complete: "已完成",
            location: "位置",
            date : "Date",
            time: "Time",
            profile: "个人资料",
            privacy: "隐私政策",
            terms: "条款和条件",
            logout: "退出登录",
            selectLocation: "选择位置",
            yourData: "您的数据",
            name: "姓名",
            age: "年龄",
            nationality: "国籍",
            medicalHistory: "病史",
            allergies: "过敏史",
            pastMedical: "既往病史",
            currentMeds: "当前用药",
            familyMedical: "家族病史",
            summary: "摘要",
            total: "总计",
            payment: "支付选项",
            submit: "提交",
            next: "下一步",
            addParticipant: "添加参与者",

            // New translations for static text
            appName: "伊真健康",
            appTagline: "为您的安全旅程提供健康检查",
            continueAgreement: "继续即表示您同意我们的",
            loginToContinue: "登录以继续",
            completeCheck: "完成您的健康检查",
            healthStatus: "健康状态：完成您的检查",
            startHealthCheck: "开始健康检查",
            recentSubmissions: "最近提交",
            pendingCount: "1 待处理",
            viewDetails: "查看详情",
            exploreRoutes: "探索伊真火山路线",
            interactiveMap: "互动地图",
            routeDescription: "通过我们的详细地图找到适合您旅程的最佳路线",
            viewFullMap: "查看完整地图",
            becomePartnerTitle: "成为合作伙伴",
            reviewInfo: "审核您的信息",
            screeningDetails: "检查详情",
            screeningSubmitted: "检查已提交",
            completePayment: "请完成支付以确认您的健康检查",
            paymentDetails: "支付详情",
            bankTransferInstructions: "银行转账说明",
            transferAmount: "转账以下显示的确切金额",
            includeReference: "在转账备注中包含参考ID",
            completeWithin: "在24小时内完成支付",
            uploadReceipt: "上传您的付款收据",
            continueToPayment: "继续到支付",
            confirmPayment: "确认支付",
            proceedToPayment: "前往支付",
            backToHome: "返回首页",
            ijenCraterExperience: "伊真火山口体验",
            becomePartnerText: "成为合作伙伴",
            registerLocation: "注册您的健康检查位置",
            submitApplication: "提交申请",
            businessName: "企业名称",
            businessType: "企业类型",
            contactPerson: "联系人",
            emailAddress: "电子邮件地址",
            phoneNumber: "电话号码",
            businessAddress: "企业地址",
            whyPartner: "您为什么想成为合作伙伴？",
            businessLicense: "营业执照",
            eTicket: "电子票",
            eTicketSubtitle: "健康检查电子票",
            healthPass: "伊真健康通行证",
            healthConfirmation: "健康检查确认",
            referenceId: "参考ID",
            participants: "参与者",
            arriveEarly: "请在预定时间前15分钟到达办理登记手续",
            showTicket: "健康检查已确认。请在到达时出示此电子票。",
            issuedBy: "发行方",
            status: "状态",
            confirmed: "已确认",
            issuingOrg: "伊真健康服务",
            viewETicket: "查看电子票",
            paymentSuccessful: "支付成功！",
            healthConfirmed: "您的健康检查已经确认",
            amount: "金额",
            account: "账户",
            accountNumber: "账号",
            accountName: "账户名",
            copy: "复制",
            processing: "处理中...",
            applicationSubmitted: "申请已提交！",
            review: "审核",
            locationDetails: "位置详情",
            selectedLocation: "已选位置",
            selectDateAndTime: "选择日期和时间",
            navHome: "首页",
            navScreening: "检查",
            navLocation: "位置",
            navProfile: "个人资料",
            bondowoso: "邦多沃索",
            banyuwangi: "班尤旺基",
            selectCity: "选择城市",
            selectCityPrompt: "请从上方的选项卡中选择一个城市以查看可用位置",
            searchLocations: "搜索位置...",
            elevation: "海拔",
            difficulty: "难度",
            facilities: "设施",
            selectThisLocation: "选择此位置",
            confirmationTitle: "确认",
            language: "语言",
            partnerDescription:
                "我们的合作伙伴计划将经过验证的健康检查提供商与前往伊真的旅行者连接起来。加入我们的网络，提供必要的徒步前健康检查。",
            uploadDocuments: "上传所需文件",
            uploadInstructions: "点击上传或拖放",
            fileTypes: "PDF、PNG、JPG，最大5MB",
            requiredField: "*",
            reviewApplication:
                "请在提交前审核您的信息。提交后，我们的团队将在3-5个工作日内审核您的申请。",
            participantInfo: "参与者信息",
            title: "称呼",
            warmClothing: "保暖衣物",
            warmClothingDesc:
                "夜间温度可能降至2°C。携带包括夹克和保暖内衣在内的层叠衣物。",
            gasMask: "防毒面具",
            gasMaskDesc: "防护硫磺气体。有租赁服务，但建议自带。",
            waterSnacks: "水和小吃",
            waterSnacksDesc: "保持水分和能量。每人至少携带1.5升水。",
            properFootwear: "适当的鞋类",
            footwearDesc: "结实的徒步鞋，提供脚踝支撑。地形多岩石且可能湿滑。",
            headlamp: "头灯",
            headlampDesc:
                "夜间徒步观看蓝色火焰必备。解放双手的照明对安全至关重要。",
            rainGear: "雨具",
            rainGearDesc: "天气可能迅速变化。携带轻便防水夹克或雨披。",
            essentialItems: "必备物品",
            bankTransfer: "银行转账",
            manualVerification: "人工验证（1-2小时）",
            creditDebitCard: "信用卡/借记卡",
            instantVerification: "即时验证",
            eWallet: "电子钱包",
            screeningFee: "检查费",
            serviceFee: "服务费",
            pinLocation: "标记您的位置",
            selectMapLocation: "点击在地图上选择您的位置",
            partnerInterest: "告诉我们您对与伊真健康合作的兴趣",
            businessDetails: "企业详情",
            locationDocuments: "位置和文档",
            progress: "进度",
        },
    };
    const t = texts[language];

    const defaultIcon = new L.Icon({
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl:
            "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    // Komponen untuk zoom ke lokasi
    function FlyToMarker({ coords }) {
        const map = useMap();
        if (coords) {
            map.flyTo([coords[0] - 0.008, coords[1]], 14);
        }
        return null;
    }

    const addParticipant = () => {
        setParticipants([
            ...participants,
            {
                title: "Mr",
                name: "",
                age: "",
                nationality: "",
                hasMedicalHistory: false,
                allergies: "",
                pastMedicalHistory: "",
                currentMedications: "",
                familyMedicalHistory: "",
            },
        ]);
    };

    const renderBottomNav = () => (
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg flex justify-around py-3 border-t">
          <button
              onClick={() => setCurrentScreen("home")}
              className={`flex flex-col items-center ${currentScreen === "home" ? "text-blue-500" : "text-gray-500"}`}
          >
              <Home size={20} />
              <span className="text-xs mt-1">{t.navHome}</span>
          </button>
          <button
              onClick={() => setCurrentScreen("screening")}
              className={`flex flex-col items-center ${currentScreen === "screening" ? "text-blue-500" : "text-gray-500"}`}
          >
              <Heart size={20} />
              <span className="text-xs mt-1">{t.navScreening}</span>
          </button>
          <button
              onClick={() => setCurrentScreen("location")}
              className={`flex flex-col items-center ${currentScreen === "location" ? "text-blue-500" : "text-gray-500"}`}
          >
              <Map size={20} />
              <span className="text-xs mt-1">{t.navLocation}</span>
          </button>
          <button
              onClick={() => setCurrentScreen("profile")}
              className={`flex flex-col items-center ${currentScreen === "profile" ? "text-blue-500" : "text-gray-500"}`}
          >
              <User size={20} />
              <span className="text-xs mt-1">{t.navProfile}</span>
          </button>
      </div>
  );

    const OnboardingScreen = () => {
        // Effect untuk menangani loading animation dan redirect ke home
        React.useEffect(() => {
            const timer = setTimeout(() => {
                setIsLoading(false);
                setCurrentScreen("form1");
            }, 3000); // 3 detik loading animation

            return () => clearTimeout(timer);
        }, []);

        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-500 to-indigo-600">
                <div className="mb-8 text-center">
                    <div className="bg-white rounded-full p-5 inline-block mb-4">
                        <Activity size={40} className="text-blue-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">
                        {t.appName}
                    </h1>
                    <p className="opacity-80 mt-2 text-white">{t.appTagline}</p>
                </div>

                <div className="flex items-center justify-center space-x-2">
                    <div
                        className="w-3 h-3 rounded-full bg-white opacity-75 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                        className="w-3 h-3 rounded-full bg-white opacity-75 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                        className="w-3 h-3 rounded-full bg-white opacity-75 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                    ></div>
                </div>
            </div>
        );
    };

    const LoginScreen = () => (
        <div className="min-h-screen flex flex-col p-6 bg-gradient-to-b from-blue-500 to-indigo-600">
            <div className="flex justify-end mb-6">
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-white bg-opacity-20 text-white border border-white border-opacity-20 rounded-md px-2 py-1"
                >
                    <option value="en">English</option>
                    <option value="id">Bahasa</option>
                    <option value="zh">中文</option>
                </select>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center text-white">
                <div className="mb-12 text-center">
                    <div className="bg-white rounded-full p-5 inline-block mb-4">
                        <Activity size={40} className="text-blue-500" />
                    </div>
                    <h1 className="text-3xl font-bold">{t.appName}</h1>
                    <p className="opacity-80 mt-2">{t.appTagline}</p>
                </div>

                <div className="w-full space-y-4">
                    <button
                        onClick={() => {
                            //   setIsLoggedIn(true);
                            setCurrentScreen("form4");
                        }}
                        className="w-full bg-white py-3 px-6 rounded-xl flex items-center justify-center space-x-2 text-blue-600 font-medium"
                    >
                        <img
                            src="https://cdn.pixabay.com/photo/2021/05/24/09/15/google-logo-6278331_1280.png"
                            alt="Google logo"
                            className="w-5 h-5 rounded-full"
                        />
                        <span>{t.loginWithGoogle}</span>
                    </button>

                    <button
                        onClick={() => {
                            //   setIsLoggedIn(true);
                            setCurrentScreen("form4");
                        }}
                        className="w-full bg-blue-400 bg-opacity-20 border border-white border-opacity-30 py-3 px-6 rounded-xl flex items-center justify-center space-x-2 text-white font-medium"
                    >
                        <Mail size={18} />
                        <span>{t.loginWithEmail}</span>
                    </button>
                </div>
            </div>

            <div className="mt-8 text-center text-white text-opacity-70 text-sm">
                <p>{t.continueAgreement}</p>
                <div className="flex justify-center space-x-1">
                    <button className="underline">{t.terms}</button>
                    <span>&</span>
                    <button className="underline">{t.privacy}</button>
                </div>
            </div>
        </div>
    );

    const LoginPopup = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
            <div className="bg-white rounded-t-xl w-full max-w-md animate-slide-up">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">
                            {t.loginToContinue}
                        </h2>
                        <button
                            onClick={() => setShowLoginPopup(false)}
                            className="text-gray-500"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="space-y-4 mb-6">
                        <button
                            onClick={() => {
                                setIsLoggedIn(true);
                                setShowLoginPopup(false);
                                setCurrentScreen("form5");
                            }}
                            className="w-full bg-blue-500 text-white py-3 px-6 rounded-xl flex items-center justify-center space-x-2 font-medium"
                        >
                            <img
                                src="https://cdn.pixabay.com/photo/2021/05/24/09/15/google-logo-6278331_1280.png"
                                alt="Google logo"
                                className="w-5 h-5 rounded-full bg-white"
                            />
                            <span>{t.loginWithGoogle}</span>
                        </button>

                        <button
                            onClick={() => {
                                setIsLoggedIn(true);
                                setShowLoginPopup(false);
                                setCurrentScreen("form4");
                            }}
                            className="w-full border border-gray-300 bg-white py-3 px-6 rounded-xl flex items-center justify-center space-x-2 text-gray-700 font-medium"
                        >
                            <Mail size={18} className="text-gray-500" />
                            <span>{t.loginWithEmail}</span>
                        </button>
                    </div>

                    <div className="text-center text-gray-500 text-sm">
                        <p>{t.continueAgreement}</p>
                        <div className="flex justify-center space-x-1">
                            <button className="text-blue-500">{t.terms}</button>
                            <span>&</span>
                            <button className="text-blue-500">
                                {t.privacy}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    const HomeScreen = () => {
        return (
            <div className="min-h-screen bg-gray-50 pb-20">
                {/* Header with gradient and weather card */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 pt-12 rounded-b-3xl shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <p className="text-blue-100">{t.hello}</p>
                            <h1 className="text-2xl font-bold">
                                {isLoggedIn ? "Arif Hassan" : t.appName}
                            </h1>
                        </div>
                        <div className="flex items-center space-x-2">
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="bg-white bg-opacity-20 text-white border border-white border-opacity-20 rounded-md text-xs px-2 py-1"
                            >
                                <option value="en">EN</option>
                                <option value="id">ID</option>
                                <option value="zh">中文</option>
                            </select>
                            <div className="relative">
                                <div className="w-12 h-12 bg-white rounded-full overflow-hidden border-2 border-white shadow-md">
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/128/17561/17561717.png"
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {isLoggedIn && (
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                        <CheckCircle size={12} className="text-white" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* Main content area with cards */}
                <div className="px-5 -mt-10">
                    {/* Health screening card with pulsing animation */}
                    <div className="bg-white rounded-2xl p-5 shadow-lg mb-6 border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full opacity-10 -mr-10 -mt-10"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-500 rounded-full opacity-10 -ml-10 -mb-10"></div>
    
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-xl text-gray-800">
                                    {t.healthScreening}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {t.completeCheck}
                                </p>
                            </div>
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                                    <Heart size={22} />
                                </div>
                                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
                                    !
                                </span>
                            </div>
                        </div>
    
                        <div className="mb-4">
                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full w-1/3"></div>
                            </div>
                            <div className="flex justify-between mt-1">
                                <span className="text-xs text-gray-500">
                                    {t.healthStatus}
                                </span>
                                <span className="text-xs font-medium text-blue-600">
                                    33%
                                </span>
                            </div>
                        </div>
    
                        <button
                            onClick={() => setCurrentScreen("form1")}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center"
                        >
                            <Activity size={18} className="mr-2" />
                            {t.startHealthCheck}
                        </button>
                    </div>
    
                    {/* Recent submissions carousel */}
                    <h2 className="font-bold text-lg text-gray-800 mb-3 flex items-center">
                        {t.recentSubmissions}
                        {screeningData.filter(item => item.status === "pending").length > 0 && (
                        <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-0.5 rounded-full ml-2">
                            {screeningData.filter(item => item.status === "pending").length} {t.pending}
                        </span>
                        )}
                    </h2>
    
                    <div className="relative">
                        {screeningData.length > 0 ? (
                        <div className="flex overflow-x-auto pb-4 -mx-2 snap-x hide-scrollbar">
                            {screeningData.map((screening, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-sm p-4 mb-2 border border-gray-100 min-w-[85%] mx-2 snap-center">
                                <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
                                    <MapPin size={18} />
                                    </div>
                                    <div>
                                    <h3 className="font-medium text-gray-800">
                                        {screening.participants[0].name || "Unnamed"}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {screening.date} • {screening.participants.length} participants
                                    </p>
                                    </div>
                                </div>
                                <div className={`px-2 py-1 rounded-full ${screening.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"} text-xs font-medium flex items-center`}>
                                    {screening.status === "pending" ? (
                                    <><Clock size={12} className="mr-1" />{t.pending}</>
                                    ) : (
                                    <><CheckCircle size={12} className="mr-1" />{t.complete}</>
                                    )}
                                </div>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500 border-t border-gray-100 pt-3 mt-2">
                                <div>
                                    <p className="flex items-center">
                                    <Calendar size={14} className="mr-1" /> {screening.date}
                                    </p>
                                </div>
                                <div>
                                    <p className="flex items-center">
                                    <Clock size={14} className="mr-1" /> {screening.time}
                                    </p>
                                </div>
                                </div>
                                <button
                                className="w-full flex justify-center items-center py-2 text-blue-500 text-sm font-medium mt-2 hover:bg-blue-50 rounded-lg transition-colors"
                                onClick={() => {
                                    setSelectedScreeningId(screening.id);
                                    setCurrentScreen("details");
                                }}
                                >
                                {t.viewDetails}
                                </button>
                            </div>
                            ))}
                        </div>
                        ) : (
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-4 border border-gray-100 text-center">
                            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                            <FileText size={24} className="text-blue-500" />
                            </div>
                            <h3 className="font-medium text-gray-800 mb-1">
                            {language === "en" ? "No screenings yet" : 
                            language === "id" ? "Belum ada pemeriksaan" : 
                            "尚无筛查记录"}
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                            {language === "en" ? "Complete a health screening to see it here" : 
                            language === "id" ? "Selesaikan pemeriksaan kesehatan untuk melihatnya di sini" : 
                            "完成健康筛查以在此处查看"}
                            </p>
                            <button 
                            onClick={() => setCurrentScreen("form1")}
                            className="text-blue-500 text-sm font-medium"
                            >
                            {t.startHealthCheck} →
                            </button>
                        </div>
                        )}
                    </div>
                    {/* Dynamic Weather Forecast Card - Main Section */}
                    <h2 className="font-bold text-lg text-gray-800 mt-6 mb-3">
                        Conditions
                    </h2>
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4 border border-gray-100">
                        <div className="p-5">
                            {/* Date selector */}
                            <div className="flex overflow-x-auto hide-scrollbar mb-6">
                                {['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, index) => {
                                    // Generate dates dynamically starting from today
                                    const date = new Date();
                                    date.setDate(date.getDate() + index);
                                    const dayNum = date.getDate();
                                    const isToday = index === 0;
                                    
                                    return (
                                        <div key={index} className="flex flex-col items-center mr-8">
                                            <span className="text-sm text-gray-500 mb-1">{day}</span>
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg ${isToday ? 'bg-green-900 text-white' : 'text-gray-700'}`}>
                                                {dayNum}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            
                            {/* Current temperature and conditions */}
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <div className="text-7xl font-normal text-green-900 mb-1">13°</div>
                                    <div className="text-xl text-gray-700 mb-1">Showers</div>
                                    <div className="text-lg text-gray-500">H:18° L:13°</div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center mb-2">
                                        <Droplets size={18} className="text-gray-500 mr-1" />
                                        <span className="text-lg text-gray-700">25%</span>
                                    </div>
                                    <div className="flex items-center text-lg text-gray-500 mb-2">
                                        <Sunrise size={18} className="mr-1" />
                                        <span>5:25 AM</span>
                                    </div>
                                    <div className="flex items-center text-lg text-gray-500">
                                        <Sunset size={18} className="mr-1" />
                                        <span>5:16 PM</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
    
                    {/* Horizontal scrollable cards section */}
                    <div className="flex overflow-x-auto pb-4 hide-scrollbar space-x-4 mb-6">
                        {/* Weather along trail card */}
                        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 min-w-[85%] flex-shrink-0">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-lg text-gray-700">Weather along trail</h4>
                                <select className="text-sm text-gray-700 bg-gray-100 rounded-full px-3 py-1 border-none">
                                    <option>11:00 PM</option>
                                    <option>12:00 AM</option>
                                    <option>1:00 AM</option>
                                </select>
                            </div>
                            
                            <div className="relative h-24 mb-2">
                                {/* The trail graph */}
                                <div className="absolute inset-0 flex items-center">
                                    <div className="h-1 bg-green-700 w-full rounded-full"></div>
                                </div>
                                {/* Temperature point */}
                                <div className="absolute top-1/2 left-1/3 transform -translate-y-1/2">
                                    <div className="w-4 h-4 bg-white rounded-full border-2 border-green-700 relative">
                                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xl text-green-900 font-medium">
                                            11°
                                        </div>
                                    </div>
                                </div>
                                {/* Path markers */}
                                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-sm text-gray-500">
                                    <span>0 km</span>
                                    <span>4.7 km</span>
                                    <span>9.4 km</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Ground conditions card */}
                        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 min-w-[70%] flex-shrink-0">
                            <div className="flex items-start">
                                <div className="flex-1">
                                    <h4 className="text-lg text-gray-700 mb-3">Ground</h4>
                                    <div className="flex items-center">
                                        <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mr-3">
                                            <Droplets size={28} className="text-white" />
                                        </div>
                                        <div>
                                            <div className="text-green-900 text-2xl font-medium">Wet</div>
                                            <div className="text-gray-600">11.06 mm in 72 hours</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
    
                    <div className="text-sm text-gray-500 mb-6 text-center">
                        Data is based on past, current, and forecasted local weather. Accuracy is not guaranteed.
                    </div>
    
                    {/* Interactive Map Card */}
                    <h2 className="font-bold text-lg text-gray-800 mb-3">
                        {t.track}
                    </h2>
                    
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border border-gray-100 relative">
                        <div className="h-48 bg-blue-100 relative">
                            <img
                                src="https://tracedetrail.fr/traces/maps/MapTrace269148_3463.jpg"
                                alt="Map"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-3 right-3">
                                <button className="bg-white rounded-full p-2 shadow-md">
                                    <MapPin size={20} className="text-blue-500" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-medium text-gray-800">
                                    {t.exploreRoutes}
                                </h3>
                                <span className="text-xs text-gray-500">
                                    {t.interactiveMap}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mb-3">
                                {t.routeDescription}
                            </p>
                            <button
                                className="w-full flex justify-center items-center py-2.5 text-white text-sm font-medium bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                                onClick={() => setShowVideoPopup(true)}
                            >
                                <Map size={18} className="mr-2" />
                                {t.viewFullMap}
                            </button>
                        </div>
                    </div>
    
                    {/* Preparation Checklist - Horizontal Scrollable Cards */}
                    <h2 className="font-bold text-lg mb-3 text-gray-800 flex items-center">
                        {t.prepare}
                        <span className="text-xs text-gray-500 font-normal ml-2">
                            {t.essentialItems}
                        </span>
                    </h2>
    
                    <div className="mb-6 px-5 -mx-5">
                        <div className="flex overflow-x-auto pb-4 px-5 hide-scrollbar snap-x">
                            {/* Card 1 - Warm Clothing */}
                            <div className="bg-white rounded-xl shadow-sm p-4 mr-3 w-[220px] border border-gray-100 flex-shrink-0 snap-start">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mb-3">
                                    <Thermometer size={22} />
                                </div>
                                <h3 className="font-medium text-gray-800 mb-1">
                                    {t.warmClothing}
                                </h3>
                                <p className="text-xs text-gray-500">
                                    {t.warmClothingDesc}
                                </p>
                            </div>
    
                            {/* Card 2 - Gas Mask */}
                            <div className="bg-white rounded-xl shadow-sm p-4 mr-3 w-[220px] border border-gray-100 flex-shrink-0 snap-start">
                                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 mb-3">
                                    <Wind size={22} />
                                </div>
                                <h3 className="font-medium text-gray-800 mb-1">
                                    {t.gasMask}
                                </h3>
                                <p className="text-xs text-gray-500">
                                    {t.gasMaskDesc}
                                </p>
                            </div>
    
                            {/* Card 3 - Water & Snacks */}
                            <div className="bg-white rounded-xl shadow-sm p-4 mr-3 w-[220px] border border-gray-100 flex-shrink-0 snap-start">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mb-3">
                                    <Droplets size={22} />
                                </div>
                                <h3 className="font-medium text-gray-800 mb-1">
                                    {t.waterSnacks}
                                </h3>
                                <p className="text-xs text-gray-500">
                                    {t.waterSnacksDesc}
                                </p>
                            </div>
    
                            {/* Card 4 - Proper Footwear */}
                            <div className="bg-white rounded-xl shadow-sm p-4 mr-3 w-[220px] border border-gray-100 flex-shrink-0 snap-start">
                                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 mb-3">
                                    <Footprints size={22} />
                                </div>
                                <h3 className="font-medium text-gray-800 mb-1">
                                    {t.properFootwear}
                                </h3>
                                <p className="text-xs text-gray-500">
                                    {t.footwearDesc}
                                </p>
                            </div>
    
                            {/* Card 5 - Headlamp */}
                            <div className="bg-white rounded-xl shadow-sm p-4 mr-3 w-[220px] border border-gray-100 flex-shrink-0 snap-start">
                                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-500 mb-3">
                                    <Flashlight size={22} />
                                </div>
                                <h3 className="font-medium text-gray-800 mb-1">
                                    {t.headlamp}
                                </h3>
                                <p className="text-xs text-gray-500">
                                    {t.headlampDesc}
                                </p>
                            </div>
    
                            {/* Card 6 - Rain Gear */}
                            <div className="bg-white rounded-xl shadow-sm p-4 mr-5 w-[220px] border border-gray-100 flex-shrink-0 snap-start">
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-500 mb-3">
                                    <Umbrella size={22} />
                                </div>
                                <h3 className="font-medium text-gray-800 mb-1">
                                    {t.rainGear}
                                </h3>
                                <p className="text-xs text-gray-500">
                                    {t.rainGearDesc}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* Add a subtle flare on the bottom nav */}
                {renderBottomNav()}
    
                {/* Add floating action button */}
                <button
                    onClick={() => setCurrentScreen("form1")}
                    className="fixed right-6 bottom-20 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg text-white transform hover:scale-105 transition-transform"
                >
                    <Plus size={24} />
                </button>
            </div>
        );
    }
    const ScreeningScreen = () => (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-white p-4 flex items-center shadow-sm">
                <h1 className="text-xl font-bold text-gray-800 flex-1 text-center">
                    {t.healthScreening}
                </h1>
            </div>

            <div className="p-4 flex space-x-2 mb-2">
                <button
                    className={`flex-1 py-2 px-4 rounded-full ${activeTab === "pending" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"} font-medium`}
                    onClick={() => setActiveTab("pending")}
                >
                    {t.pending}
                </button>
                <button
                    className={`flex-1 py-2 px-4 rounded-full ${activeTab === "complete" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"} font-medium`}
                    onClick={() => setActiveTab("complete")}
                >
                    {t.complete}
                </button>
            </div>

            <div className="px-4 py-2">
      {screeningData.filter(item => item.status === activeTab).length > 0 ? (
        screeningData
          .filter(item => item.status === activeTab)
          .map((screening, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-4 mb-4 border border-gray-100"
              onClick={() => {
                setSelectedScreeningId(screening.id);
                setCurrentScreen("details");
              }}
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {screening.participants[0].name || "Unnamed"}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {screening.date} • {screening.participants.length} participants
                    </p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full ${activeTab === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"} text-xs font-medium`}>
                  {activeTab === "pending" ? t.pending : t.complete}
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-500 border-t border-gray-100 pt-3 mt-2">
                <div>
                  <p className="flex items-center">
                    <Calendar size={14} className="mr-1" /> {screening.date}
                  </p>
                </div>
                <div>
                  <p className="flex items-center">
                    <Clock size={14} className="mr-1" /> {screening.time}
                  </p>
                </div>
              </div>
            </div>
          ))
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            {activeTab === "pending" ? (
              <Clock size={24} className="text-gray-400" />
            ) : (
              <CheckCircle size={24} className="text-gray-400" />
            )}
          </div>
          <h3 className="font-medium text-gray-800 mb-1">
            {language === "en" ? `No ${activeTab} screenings` : 
             language === "id" ? `Tidak ada pemeriksaan ${activeTab === "pending" ? "tertunda" : "selesai"}` : 
             `没有${activeTab === "pending" ? "待处理" : "已完成"}的筛查`}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {language === "en" ? "Schedule a health screening to see it here" : 
             language === "id" ? "Jadwalkan pemeriksaan kesehatan untuk melihatnya di sini" : 
             "安排健康筛查以在此处查看"}
          </p>
          <button 
            onClick={() => setCurrentScreen("form1")}
            className="text-blue-500 text-sm font-medium"
          >
            {t.startHealthCheck} →
          </button>
        </div>
      )}
    </div>


            <button
                className="fixed right-6 bottom-20 w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center shadow-lg text-white"
                onClick={() => setCurrentScreen("form1")}
            >
                <Plus size={24} />
            </button>

            {renderBottomNav()}
        </div>
    );
    const LocationScreen = () => {
        const [selectedPoint, setSelectedPoint] = useState(null);
        const [showDetail, setShowDetail] = useState(false);
        const [searchQuery, setSearchQuery] = useState("");
        const [selectedCity, setSelectedCity] = useState(null);

        // Updated locations with city field added to each location
        const locations = [
            {
                id: 1,
                name: "Baratha Hotel",
                coords: [-7.91303, 113.807867],
                description: "Most popular entry point",
                details:
                    "Paltuding is the main starting point for hikers. It has complete facilities including parking area, toilets, and small shops.",
                elevation: "1,850m",
                difficulty: "Moderate",
                facilities: [
                    "Parking",
                    "Toilets",
                    "Food stalls",
                    "Guide service",
                ],
                city: "Bondowoso",
            },
            {
                id: 2,
                name: "Riverside Homestay",
                coords: [-7.932059, 113.824877],
                description: "Eastern entry point",
                details:
                    "Located on the eastern side with less crowded trail. Better for experienced hikers.",
                elevation: "1,720m",
                difficulty: "Challenging",
                facilities: [
                    "Limited parking",
                    "Basic toilets",
                    "Guide required",
                ],
                city: "Bondowoso",
            },
            {
                id: 3,
                name: "Grand Padis Hotel",
                coords: [-7.915963, 113.819655],
                description: "Northern entry point",
                details:
                    "Longer route but offers beautiful landscapes. Recommended for nature photography enthusiasts.",
                elevation: "1,950m",
                difficulty: "Hard",
                facilities: ["Parking", "Rest area", "Camping site"],
                city: "Bondowoso",
            },
            {
                id: 4,
                name: "Luminor Hotel",
                coords: [-8.210083, 114.369759],
                description: "City center hotel",
                details:
                    "Modern hotel in the heart of Banyuwangi with shuttle service to Ijen.",
                elevation: "1,850m",
                difficulty: "Easy",
                facilities: [
                    "Shuttle service",
                    "Restaurant",
                    "WiFi",
                    "Tour desk",
                ],
                city: "Banyuwangi",
            },
            {
                id: 5,
                name: "Santika Hotel",
                coords: [-8.219246, 114.364867],
                description: "Near shopping district",
                details:
                    "Comfortable accommodation with easy access to local markets and restaurants.",
                elevation: "1,800m",
                difficulty: "Easy",
                facilities: ["Restaurant", "Pool", "WiFi", "Parking"],
                city: "Banyuwangi",
            },
        ];

        // Get center coordinates for map based on selected city
        const getCityCenter = (city) => {
            if (city === "Bondowoso") return [-7.91303, 113.820867];
            if (city === "Banyuwangi") return [-8.215083, 114.367759];
            return [-7.91303, 113.820867]; // Default to Bondowoso
        };

        // Get active locations for the selected city
        const activeLocations = selectedCity
            ? locations.filter((location) => location.city === selectedCity)
            : [];

        // Filter locations based on search query
        const filteredLocations = activeLocations.filter((location) =>
            location.name.toLowerCase().includes(searchQuery.toLowerCase()),
        );

        const handleMarkerClick = (location) => {
            setSelectedPoint(location);
            setShowDetail(true);
            setSearchQuery(""); // Reset search after selecting location
        };

        const handleSelectLocation = () => {
            // Save selected location and proceed to next screen
            setSelectedLocationFromMap(selectedPoint);
            setCurrentScreen("form1");
        };

        // Component to update map center when city changes
        function SetMapCenter({ city }) {
            const map = useMap();

            useEffect(() => {
                if (city) {
                    const center = getCityCenter(city);
                    map.setView(center, 14);
                }
            }, [city, map]);

            return null;
        }

        // Component for zooming to location
        function FlyToMarker({ coords }) {
            const map = useMap();
            if (coords) {
                map.flyTo([coords[0] - 0.008, coords[1]], 14);
            }
            return null;
        }

        return (
            <div className="min-h-screen bg-gray-50 relative">
                <div className="bg-white p-4 flex items-center shadow-sm">
                    <button
                        onClick={() => setCurrentScreen("home")}
                        className="mr-2"
                    >
                        <ArrowLeft size={24} className="text-gray-800" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">
                        {t.location}
                    </h1>
                </div>

                {/* City selection tabs */}
                <div className="bg-white px-4 py-3 flex space-x-2 shadow-sm">
                    <button
                        className={`flex-1 py-2 px-4 rounded-full text-sm font-medium ${selectedCity === "Bondowoso" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"}`}
                        onClick={() => setSelectedCity("Bondowoso")}
                    >
                        {t.bondowoso}
                    </button>
                    <button
                        className={`flex-1 py-2 px-4 rounded-full text-sm font-medium ${selectedCity === "Banyuwangi" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"}`}
                        onClick={() => setSelectedCity("Banyuwangi")}
                    >
                        {t.banyuwangi}
                    </button>
                </div>

                {!selectedCity ? (
                    // Instructions when no city is selected
                    <div className="p-6 flex flex-col items-center justify-center h-64 text-center">
                        <MapPin size={40} className="text-blue-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-800 mb-2">
                            {t.selectCity}
                        </h3>
                        <p className="text-gray-600">{t.selectCityPrompt}</p>
                    </div>
                ) : (
                    <>
                        <div className="p-4 pt-3 relative z-10">
                            <div className="relative mb-1">
                                <input
                                    type="text"
                                    placeholder={t.searchLocations}
                                    className="w-full bg-white rounded-lg py-3 px-4 pl-10 shadow-sm border border-gray-200"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                                <Search
                                    size={18}
                                    className="absolute left-3 top-3.5 text-gray-400"
                                />
                            </div>

                            {/* Search Results Dropdown */}
                            {searchQuery && filteredLocations.length > 0 && (
                                <div className="absolute left-4 right-4 bg-white rounded-lg shadow-lg mt-1 z-20 border border-gray-200 overflow-hidden">
                                    {filteredLocations.map((location) => (
                                        <div
                                            key={location.id}
                                            className="p-3 border-b border-gray-100 flex items-center cursor-pointer hover:bg-gray-50"
                                            onClick={() =>
                                                handleMarkerClick(location)
                                            }
                                        >
                                            <MapPin
                                                size={16}
                                                className="text-blue-500 mr-2"
                                            />
                                            <span>{location.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Map Container */}
                        <div className="absolute top-[180px] left-0 right-0 bottom-0 z-0">
                            <MapContainer
                                center={getCityCenter(selectedCity)}
                                zoom={14}
                                style={{ height: "100%", width: "100%" }}
                                zoomControl={false}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    className="grayscale brightness-105 contrast-105"
                                />

                                {/* Add this to update center when city changes */}
                                <SetMapCenter city={selectedCity} />

                                {activeLocations.map((location) => (
                                    <Marker
                                        key={location.id}
                                        position={location.coords}
                                        icon={defaultIcon}
                                        eventHandlers={{
                                            click: () =>
                                                handleMarkerClick(location),
                                        }}
                                    >
                                        <Popup>{location.name}</Popup>
                                    </Marker>
                                ))}

                                {selectedPoint && (
                                    <FlyToMarker
                                        coords={selectedPoint.coords}
                                    />
                                )}
                            </MapContainer>
                        </div>
                    </>
                )}

                {/* Fixed Detail Panel that appears from the bottom */}
                {showDetail && selectedPoint && (
                    <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl p-6 shadow-lg z-10 max-h-[65%] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-lg text-gray-800">
                                {selectedPoint.name}
                            </h2>
                            <button
                                onClick={() => setShowDetail(false)}
                                className="bg-gray-100 rounded-full p-2"
                            >
                                <X size={16} className="text-gray-600" />
                            </button>
                        </div>

                        <p className="text-gray-600 mb-4">
                            {selectedPoint.details}
                        </p>

                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl mb-3">
                            <span className="text-gray-700">{t.elevation}</span>
                            <span className="font-medium">
                                {selectedPoint.elevation}
                            </span>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl mb-3">
                            <span className="text-gray-700">
                                {t.difficulty}
                            </span>
                            <span className="font-medium">
                                {selectedPoint.difficulty}
                            </span>
                        </div>

                        <div className="mb-4">
                            <span className="text-gray-700 block mb-2">
                                {t.facilities}
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {selectedPoint.facilities.map(
                                    (facility, index) => (
                                        <span
                                            key={index}
                                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                                        >
                                            {facility}
                                        </span>
                                    ),
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleSelectLocation}
                            className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium"
                        >
                            {t.selectThisLocation}
                        </button>
                    </div>
                )}

                {/* Bottom Nav - absolute position to appear above map but below detail panel */}
                <div className="absolute bottom-0 left-0 right-0 z-[5]">
                    {renderBottomNav()}
                </div>
            </div>
        );
    };
    const ProfileScreen = () => {
        const [showPartnerForm, setShowPartnerForm] = useState(false);

        return (
            <div className="min-h-screen bg-gray-50 pb-20">
                <div className="bg-white p-4 flex items-center shadow-sm">
                    <h1 className="text-xl font-bold text-gray-800 flex-1 text-center">
                        {t.profile}
                    </h1>
                </div>

                <div className="p-6 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-blue-100 overflow-hidden mb-3">
                        <img
                            src="https://cdn-icons-png.flaticon.com/128/17561/17561717.png"
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h2 className="font-bold text-xl text-gray-800">
                        Arif Hassan
                    </h2>
                    <p className="text-gray-500 mb-6">
                        arif.hassan@example.com
                    </p>

                    <div className="w-full space-y-4">
                        <button
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded-xl font-medium flex items-center justify-between mb-6 shadow-md"
                            onClick={() => setShowPartnerForm(true)}
                        >
                            <div className="flex items-center">
                                <div className="bg-white p-2 rounded-full mr-3">
                                    <MapPin
                                        size={20}
                                        className="text-blue-500"
                                    />
                                </div>
                                <div className="text-left">
                                    <span className="font-bold">
                                        {t.becomePartnerTitle}
                                    </span>
                                    <p className="text-xs text-blue-100">
                                        {t.registerLocation}
                                    </p>
                                </div>
                            </div>
                            <ChevronRight size={20} className="text-white" />
                        </button>
                        <button className="w-full flex justify-between items-center p-4 bg-white rounded-xl shadow-sm mb-4">
                            <div className="flex items-center">
                                <Globe
                                    size={20}
                                    className="text-gray-500 mr-3"
                                />
                                <span>{language}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-gray-500 mr-2">
                                    {language === "en"
                                        ? "English"
                                        : language === "id"
                                          ? "Bahasa"
                                          : "中文"}
                                </span>
                                <ChevronRight
                                    size={20}
                                    className="text-gray-400"
                                />
                            </div>
                        </button>
                        <button className="w-full flex justify-between items-center p-4 bg-white rounded-xl shadow-sm">
                            <div className="flex items-center">
                                <FileText
                                    size={20}
                                    className="text-gray-500 mr-3"
                                />
                                <span>{t.privacy}</span>
                            </div>
                            <ChevronRight size={20} className="text-gray-400" />
                        </button>

                        <button className="w-full flex justify-between items-center p-4 bg-white rounded-xl shadow-sm">
                            <div className="flex items-center">
                                <FileText
                                    size={20}
                                    className="text-gray-500 mr-3"
                                />
                                <span>{t.terms}</span>
                            </div>
                            <ChevronRight size={20} className="text-gray-400" />
                        </button>

                        <button
                            className="w-full flex justify-between items-center p-4 bg-white rounded-xl shadow-sm text-red-500"
                            onClick={() => setCurrentScreen("login")}
                        >
                            <div className="flex items-center">
                                <LogOut size={20} className="mr-3" />
                                <span>{t.logout}</span>
                            </div>
                        </button>
                    </div>
                </div>

                {showPartnerForm && (
                    <PartnerApplicationForm
                        onClose={() => setShowPartnerForm(false)}
                    />
                )}

                {renderBottomNav()}
            </div>
        );
    };

    const PartnerApplicationForm = ({ onClose }) => {
        const [formData, setFormData] = useState({
            businessName: "",
            businessType: "Health Center",
            contactPerson: "",
            email: "",
            phone: "",
            address: "",
            reason: "",
            locationCoords: { lat: null, lng: null },
        });

        const [step, setStep] = useState(1);
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [isSuccess, setIsSuccess] = useState(false);

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: value }));
        };

        const handleSubmit = () => {
            setIsSubmitting(true);
            // Simulate API call
            setTimeout(() => {
                setIsSubmitting(false);
                setIsSuccess(true);
                // Auto close after success
                setTimeout(() => {
                    onClose();
                }, 2000);
            }, 1500);
        };

        const handleNext = () => {
            setStep((prev) => prev + 1);
        };

        const handleBack = () => {
            if (step > 1) {
                setStep((prev) => prev - 1);
            } else {
                onClose();
            }
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                <div className="bg-white rounded-xl w-full max-w-md mx-4 max-h-[90vh] overflow-auto">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <button onClick={handleBack} className="p-2">
                            {step > 1 ? (
                                <ArrowLeft
                                    size={20}
                                    className="text-gray-500"
                                />
                            ) : (
                                <X size={20} className="text-gray-500" />
                            )}
                        </button>
                        <h2 className="text-lg font-bold text-center flex-1">
                            Become A Partner
                        </h2>
                        <div className="w-10"></div>{" "}
                        {/* Spacer for alignment */}
                    </div>

                    {/* Progress indicator */}
                    <div className="px-4 pt-2">
                        <div className="flex justify-between mb-2">
                            <span className="text-xs text-gray-500">
                                Business Details
                            </span>
                            <span className="text-xs text-gray-500">
                                Location & Documents
                            </span>
                            <span className="text-xs text-gray-500">
                                Review
                            </span>
                        </div>
                        <div className="h-1 bg-gray-200 rounded-full">
                            <div
                                className="h-1 bg-blue-500 rounded-full transition-all duration-300"
                                style={{ width: `${(step / 3) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Form content */}
                    <div className="p-6">
                        {step === 1 && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Business Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="businessName"
                                        value={formData.businessName}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg p-3"
                                        placeholder="Enter your business or clinic name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Business Type *
                                    </label>
                                    <select
                                        name="businessType"
                                        value={formData.businessType}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg p-3"
                                        required
                                    >
                                        <option value="Health Center">
                                            Health Center
                                        </option>
                                        <option value="Medical Clinic">
                                            Medical Clinic
                                        </option>
                                        <option value="Hospital">
                                            Hospital
                                        </option>
                                        <option value="Private Practice">
                                            Private Practice
                                        </option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Contact Person *
                                    </label>
                                    <input
                                        type="text"
                                        name="contactPerson"
                                        value={formData.contactPerson}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg p-3"
                                        placeholder="Full name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg p-3"
                                        placeholder="email@example.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg p-3"
                                        placeholder="+62..."
                                        required
                                    />
                                </div>

                                <button
                                    onClick={handleNext}
                                    className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium mt-4"
                                    disabled={
                                        !formData.businessName ||
                                        !formData.contactPerson ||
                                        !formData.email ||
                                        !formData.phone
                                    }
                                >
                                    Next
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Business Address *
                                    </label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg p-3"
                                        rows={3}
                                        placeholder="Enter your full address"
                                        required
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Pin Your Location
                                    </label>
                                    <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <div className="text-center p-4">
                                            <MapPin
                                                size={24}
                                                className="text-blue-500 mx-auto mb-2"
                                            />
                                            <p className="text-sm text-gray-600">
                                                Click to select your location on
                                                map
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Why do you want to become a health
                                        screening partner? *
                                    </label>
                                    <textarea
                                        name="reason"
                                        value={formData.reason}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg p-3"
                                        rows={3}
                                        placeholder="Tell us about your interest in partnering with Ijen Health"
                                        required
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Upload Required Documents
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center">
                                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                                            <Upload
                                                size={24}
                                                className="text-blue-500"
                                            />
                                        </div>
                                        <p className="text-sm text-gray-500 text-center mb-2">
                                            Medical license, business permit
                                        </p>
                                        <p className="text-xs text-gray-400 text-center">
                                            PDF, PNG, JPG up to 5MB
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleNext}
                                    className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium mt-4"
                                    disabled={
                                        !formData.address || !formData.reason
                                    }
                                >
                                    Next
                                </button>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-4">
                                <h3 className="font-medium text-gray-800 mb-1">
                                    Review Your Information
                                </h3>

                                <div className="p-4 bg-blue-50 rounded-lg mb-4">
                                    <p className="text-sm text-blue-800 mb-2">
                                        Please review your information before
                                        submitting. After submission, our team
                                        will review your application within 3-5
                                        business days.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Business Name
                                        </span>
                                        <span className="font-medium">
                                            {formData.businessName}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Business Type
                                        </span>
                                        <span className="font-medium">
                                            {formData.businessType}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Contact Person
                                        </span>
                                        <span className="font-medium">
                                            {formData.contactPerson}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Email
                                        </span>
                                        <span className="font-medium">
                                            {formData.email}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Phone
                                        </span>
                                        <span className="font-medium">
                                            {formData.phone}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Address
                                        </span>
                                        <span className="font-medium text-right flex-1 ml-4">
                                            {formData.address}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <button
                                        onClick={handleSubmit}
                                        className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium mb-3"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center justify-center">
                                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                                                Processing...
                                            </span>
                                        ) : isSuccess ? (
                                            <span className="flex items-center justify-center">
                                                <CheckCircle
                                                    size={18}
                                                    className="mr-2"
                                                />
                                                Application Submitted!
                                            </span>
                                        ) : (
                                            "Submit Application"
                                        )}
                                    </button>

                                    <button
                                        onClick={handleBack}
                                        className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-medium"
                                        disabled={isSubmitting || isSuccess}
                                    >
                                        Back
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };
    const Form1Screen = () => {
        const [selectedLocation, setSelectedLocation] = useState(
            selectedLocationFromMap,
        );
        const [selectedDate, setSelectedDate] = useState(15);
        const [selectedTime, setSelectedTime] = useState(null);
        const [searchQuery, setSearchQuery] = useState("");
        const [showDetail, setShowDetail] = useState(
            selectedLocationFromMap !== null,
        );
        const [selectedCity, setSelectedCity] = useState(null);

        const timeSlots = [
            {
                id: 1,
                start: "04:30",
                end: "05:30",
                label: "Morning",
                available: true,
            },
            {
                id: 2,
                start: "05:30",
                end: "06:30",
                label: "Sunrise",
                available: true,
            },
            {
                id: 3,
                start: "15:00",
                end: "16:00",
                label: "Afternoon",
                available: true,
            },
            {
                id: 4,
                start: "20:00",
                end: "21:00",
                label: "Night (Blue Fire)",
                available: true,
            },
        ];

        // Updated locations with city field added to each location
        const locations = [
            {
                id: 1,
                name: "Baratha Hotel",
                coords: [-7.91303, 113.807867],
                description: "Most popular entry point",
                city: "Bondowoso",
            },
            {
                id: 2,
                name: "Riverside Homestay",
                coords: [-7.932059, 113.824877],
                description: "Eastern entry point",
                city: "Bondowoso",
            },
            {
                id: 3,
                name: "Grand Padis Hotel",
                coords: [-7.915963, 113.819655],
                description: "Northern entry point",
                city: "Bondowoso",
            },
            {
                id: 4,
                name: "Luminor Hotel",
                coords: [-8.210083, 114.369759],
                description: "City center hotel",
                city: "Banyuwangi",
            },
            {
                id: 5,
                name: "Santika Hotel",
                coords: [-8.219246, 114.364867],
                description: "Near shopping district",
                city: "Banyuwangi",
            },
        ];
        function SetMapCenter({ city }) {
            const map = useMap();

            useEffect(() => {
                if (city) {
                    const center = getCityCenter(city);
                    map.setView(center, 14);
                }
            }, [city, map]);

            return null;
        }

        // Get center coordinates for map based on selected city
        const getCityCenter = (city) => {
            if (city === "Bondowoso") return [-7.91303, 113.820867];
            if (city === "Banyuwangi") return [-8.215083, 114.367759];
            return [-7.91303, 113.820867]; // Default to Bondowoso
        };

        useEffect(() => {
            if (selectedLocationFromMap) {
                // Find the location and set its city
                const fullLocationDetails = locations.find(
                    (loc) => loc.id === selectedLocationFromMap.id,
                );
                if (fullLocationDetails) {
                    setSelectedCity(fullLocationDetails.city);
                    setSelectedLocation(fullLocationDetails);
                    setShowDetail(true);
                }
            }
        }, []);

        // Get active locations for the selected city
        const activeLocations = selectedCity
            ? locations.filter((location) => location.city === selectedCity)
            : [];

        // Filter locations based on search query
        const filteredLocations = activeLocations.filter((location) =>
            location.name.toLowerCase().includes(searchQuery.toLowerCase()),
        );

        const handleMarkerClick = (location) => {
            setSelectedLocation(location);
            setShowDetail(true);
            setSearchQuery(""); // Reset search after selecting location
        };

        const handleProceed = () => {
            if (selectedLocation && selectedDate && selectedTime) {
                setCurrentScreen("form2");
            }
        };

        // Component for zooming to location
        function FlyToMarker({ coords }) {
            const map = useMap();
            if (coords) {
                // Zoom to location with offset so marker is visible above detail panel
                map.flyTo([coords[0] - 0.008, coords[1]], 14);
            }
            return null;
        }
        const getHeightTopRef = useRef(null);
        const bottomNavRef = useRef(null);
        const [heightTop, setHeightTop] = useState(0);
        const [heightBottomNav, setHeightBottomNav] = useState(0);
        const [mapHeight, setMapHeight] = useState("50vh");
    
        // Get heights and calculate map height
        useEffect(() => {
            const updateHeights = () => {
                if (getHeightTopRef.current && bottomNavRef.current) {
                    const topHeight = getHeightTopRef.current.offsetHeight;
                    const navHeight = bottomNavRef.current.offsetHeight;
                    setHeightTop(topHeight);
                    setHeightBottomNav(navHeight);
                    
                    // Calculate remaining height (subtract a bit extra for any padding/margins)
                    const windowHeight = window.innerHeight;
                    const calculatedHeight = windowHeight - topHeight - navHeight - 20;
                    setMapHeight(`${calculatedHeight}px`);
                }
            };
    
            updateHeights();
            // Also update on window resize
            window.addEventListener('resize', updateHeights);
            return () => window.removeEventListener('resize', updateHeights);
        }, [selectedCity]); // Recalculate when city changes as this affects layout

        return (
            <div className="min-h-screen bg-gray-50 relative">
                <div ref={getHeightTopRef}>
                    <div className="bg-white p-4 flex items-center shadow-sm">
                        <button
                            onClick={() => setCurrentScreen("home")}
                            className="mr-2"
                        >
                            <ArrowLeft size={24} className="text-gray-800" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-800">
                            {t.selectLocation}
                        </h1>
                    </div>

                    {/* City selection tabs */}
                    <div className="bg-white px-4 py-3">
                        <div>
                            <div className="flex overflow-x-auto pb-2 mb-4 space-x-2">
                                {[
                                    14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
                                ].map((day) => (
                                    <div
                                        key={day}
                                        className={`flex-shrink-0 w-12 h-14 rounded-lg ${day === selectedDate ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"} flex flex-col items-center justify-center cursor-pointer`}
                                        onClick={() => setSelectedDate(day)}
                                    >
                                        <span className="text-xs opacity-80">
                                            MAY
                                        </span>
                                        <span className="text-lg font-bold">
                                            {day}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>  
                        <div className="flex space-x-2 shadow-sm">
                            <button
                                className={`flex-1 py-2 px-4 rounded-full text-sm font-medium ${selectedCity === "Bondowoso" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"}`}
                                onClick={() => setSelectedCity("Bondowoso")}
                            >
                                {t.bondowoso}
                            </button>
                            <button
                                className={`flex-1 py-2 px-4 rounded-full text-sm font-medium ${selectedCity === "Banyuwangi" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"}`}
                                onClick={() => setSelectedCity("Banyuwangi")}
                            >
                                {t.banyuwangi}
                            </button>
                        </div>
                    </div>
                </div>

                {!selectedCity ? (
                    // Instructions when no city is selected
                    <div className="p-6 flex flex-col items-center justify-center h-64 text-center">
                        <MapPin size={40} className="text-blue-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-800 mb-2">
                            {t.selectCity}
                        </h3>
                        <p className="text-gray-600">{t.selectCityPrompt}</p>
                    </div>
                ) : (
                    <div className="relative" style={{ height: mapHeight }}>
                        <div className="p-4 pt-3 relative z-10">
                            <div className="relative mb-1">
                                <input
                                    type="text"
                                    placeholder={t.searchLocations}
                                    className="w-full bg-white rounded-lg py-3 px-4 pl-10 shadow-sm border border-gray-200"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                                <Search
                                    size={18}
                                    className="absolute left-3 top-3.5 text-gray-400"
                                />
                            </div>

                            {/* Search Results Dropdown */}
                            {searchQuery && filteredLocations.length > 0 && (
                                <div className="absolute left-4 right-4 bg-white rounded-lg shadow-lg mt-1 z-20 border border-gray-200 overflow-hidden">
                                    {filteredLocations.map((location) => (
                                        <div
                                            key={location.id}
                                            className="p-3 border-b border-gray-100 flex items-center cursor-pointer hover:bg-gray-50"
                                            onClick={() =>
                                                handleMarkerClick(location)
                                            }
                                        >
                                            <MapPin
                                                size={16}
                                                className="text-blue-500 mr-2"
                                            />
                                            <span>{location.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Map Container */}
                        <div className="absolute h-[100%] top-0 left-0 right-0 bottom-0 z-0">
                            <MapContainer
                                center={getCityCenter(selectedCity)}
                                zoom={14}
                                style={{ height: "100%", width: "100%" }}
                                zoomControl={false}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    className="grayscale brightness-105 contrast-105"
                                />

                                {/* Add this line to update center when city changes */}
                                <SetMapCenter city={selectedCity} />

                                {activeLocations.map((location) => (
                                    <Marker
                                        key={location.id}
                                        position={location.coords}
                                        icon={defaultIcon}
                                        eventHandlers={{
                                            click: () =>
                                                handleMarkerClick(location),
                                        }}
                                    >
                                        <Popup>{location.name}</Popup>
                                    </Marker>
                                ))}

                                {selectedLocation && (
                                    <FlyToMarker
                                        coords={selectedLocation.coords}
                                    />
                                )}
                            </MapContainer>
                        </div>
                    </div>
                )}

                {/* Fixed Detail Panel with Date & Time */}
                {showDetail && selectedLocation && (
                    <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl p-6 shadow-lg z-10 max-h-[70%] overflow-y-auto">
                        <div className="mb-4">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
                                    <MapPin size={16} />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-medium text-gray-800">
                                        {selectedLocation.name}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {selectedLocation.description}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowDetail(false)}
                                    className="ml-auto"
                                >
                                    <X size={16} className="text-gray-400" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {timeSlots.map((slot) => (
                                <div
                                    key={slot.id}
                                    className={`p-3 rounded-lg ${selectedTime === slot.id ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"} flex flex-col items-center cursor-pointer ${!slot.available ? "opacity-50" : ""}`}
                                    onClick={() =>
                                        slot.available &&
                                        setSelectedTime(slot.id)
                                    }
                                >
                                    <span className="text-xs opacity-80">
                                        {slot.label}
                                    </span>
                                    <span className="text-sm font-medium">
                                        {slot.start} - {slot.end}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleProceed}
                            className={`w-full py-3 rounded-xl font-medium ${selectedDate && selectedTime ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"}`}
                            disabled={!selectedDate || !selectedTime}
                        >
                            {t.next}
                        </button>
                    </div>
                )}
                <div ref={bottomNavRef}>
                    {renderBottomNav()}
                </div>
            </div>
        );
    };

    const Form2Screen = () => {
        // Add new state for validation
        const [validationErrors, setValidationErrors] = useState({});
        
        // Update the participants state to include idNumber field
        const [participants, setParticipants] = useState([
            {
                title: "Mr",
                name: "",
                age: "",
                nationality: "",
                idNumber: "",
                hasMedicalHistory: false,
                allergies: "",
                pastMedicalHistory: "",
                currentMedications: "",
                familyMedicalHistory: "",
            },
        ]);
    
        // Function to validate ID numbers based on nationality
        const validateIdNumber = (nationality, idNumber, index) => {
            const errors = {...validationErrors};
            
            if (!idNumber) {
                errors[`idNumber_${index}`] = "ID number is required";
            } else if (nationality === "Indonesia" && !/^\d{16}$/.test(idNumber)) {
                // KTP must be exactly 16 digits
                errors[`idNumber_${index}`] = "KTP must be 16 digits";
            } else if (nationality !== "Indonesia" && !/^[A-Z0-9]{8,9}$/.test(idNumber)) {
                // Passport is typically 8-9 alphanumeric chars
                errors[`idNumber_${index}`] = "Passport must be 8-9 characters";
            } else {
                delete errors[`idNumber_${index}`];
            }
            
            setValidationErrors(errors);
        };
    
        // Handle input changes for all participant fields
        const handleInputChange = (index, field, value) => {
            const updatedParticipants = [...participants];
            updatedParticipants[index][field] = value;
            
            // Validate ID number when it changes
            if (field === "idNumber") {
                validateIdNumber(
                    updatedParticipants[index].nationality, 
                    value, 
                    index
                );
            }
            
            // Also validate if nationality changes (which affects ID type)
            if (field === "nationality") {
                validateIdNumber(
                    value, 
                    updatedParticipants[index].idNumber, 
                    index
                );
            }
            
            setParticipants(updatedParticipants);
        };
    
        const addParticipant = () => {
            setParticipants([
                ...participants,
                {
                    title: "Mr",
                    name: "",
                    age: "",
                    nationality: "",
                    idNumber: "",
                    hasMedicalHistory: false,
                    allergies: "",
                    pastMedicalHistory: "",
                    currentMedications: "",
                    familyMedicalHistory: "",
                },
            ]);
        };
    
        // Check if form can proceed
        const canProceed = () => {
            return Object.keys(validationErrors).length === 0 && 
                participants.every(p => p.name && p.age && p.nationality && p.idNumber);
        };
    
        return (
            <div className="min-h-screen bg-gray-50 pb-20">
                <div className="bg-white p-4 flex items-center shadow-sm">
                    <button
                        onClick={() => setCurrentScreen("form1")}
                        className="mr-2"
                    >
                        <ArrowLeft size={24} className="text-gray-800" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">
                        {t.participantInfo}
                    </h1>
                </div>
    
                <div className="p-6">
                    {participants.map((participant, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-sm p-4 mb-6"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-bold text-lg text-gray-800">
                                    {t.participantInfo} {index + 1}
                                </h2>
                                {index > 0 && (
                                    <button
                                        className="text-red-500"
                                        onClick={() =>
                                            setParticipants(
                                                participants.filter(
                                                    (_, i) => i !== index,
                                                ),
                                            )
                                        }
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>
    
                            <div className="space-y-4">
                                <div className="flex space-x-3">
                                    <div className="w-24">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t.title}
                                        </label>
                                        <select 
                                            className="w-full border border-gray-300 rounded-lg p-3"
                                            value={participant.title}
                                            onChange={(e) => handleInputChange(index, "title", e.target.value)}
                                        >
                                            <option>Mr</option>
                                            <option>Mrs</option>
                                            <option>Ms</option>
                                        </select>
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t.name}
                                        </label>
                                        <input
                                            type="text"
                                            value={participant.name}
                                            onChange={(e) => handleInputChange(index, "name", e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg p-3"
                                        />
                                    </div>
                                </div>
    
                                <div className="flex space-x-3">
                                    <div className="w-24">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t.age}
                                        </label>
                                        <input
                                            type="number"
                                            value={participant.age}
                                            onChange={(e) => handleInputChange(index, "age", e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg p-3"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t.nationality}
                                        </label>
                                        <select 
                                            className="w-full border border-gray-300 rounded-lg p-3"
                                            value={participant.nationality}
                                            onChange={(e) => handleInputChange(index, "nationality", e.target.value)}
                                        >
                                            <option value="">Select...</option>
                                            <option value="Indonesia">Indonesia</option>
                                            <option value="Malaysia">Malaysia</option>
                                            <option value="Singapore">Singapore</option>
                                            <option value="Australia">Australia</option>
                                            <option value="United States">United States</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
    
                                {/* ID Number section - automatically set based on nationality */}
                                <div className="space-y-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {participant.nationality === "Indonesia" ? "KTP Number" : "Passport Number"}
                                        </label>
                                        <input
                                            type="text"
                                            value={participant.idNumber}
                                            onChange={(e) => handleInputChange(index, "idNumber", e.target.value)}
                                            className={`w-full border ${validationErrors[`idNumber_${index}`] ? "border-red-500" : "border-gray-300"} rounded-lg p-3`}
                                            placeholder={participant.nationality === "Indonesia" ? "16 digits" : "8-9 characters"}
                                        />
                                        {validationErrors[`idNumber_${index}`] && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {validationErrors[`idNumber_${index}`]}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-500 mt-1">
                                            {participant.nationality === "Indonesia" 
                                                ? "KTP must be 16 digits" 
                                                : "Passport must be 8-9 alphanumeric characters"}
                                        </p>
                                    </div>
                                </div>
    
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-700">
                                        {t.medicalHistory}
                                    </span>
                                    <div
                                        className={`w-12 h-6 rounded-full ${participant.hasMedicalHistory ? "bg-blue-500" : "bg-gray-300"} flex items-center p-1 transition-all duration-200`}
                                    >
                                        <div
                                            className={`w-4 h-4 rounded-full bg-white transform transition-all duration-200 ${participant.hasMedicalHistory ? "translate-x-6" : ""}`}
                                            onClick={() => {
                                                const newParticipants = [
                                                    ...participants,
                                                ];
                                                newParticipants[
                                                    index
                                                ].hasMedicalHistory =
                                                    !newParticipants[index]
                                                        .hasMedicalHistory;
                                                setParticipants(newParticipants);
                                            }}
                                        ></div>
                                    </div>
                                </div>
    
                                {participant.hasMedicalHistory && (
                                    <div className="space-y-4 p-3 bg-blue-50 rounded-lg">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {t.allergies}
                                            </label>
                                            <input
                                                type="text"
                                                value={participant.allergies}
                                                onChange={(e) => handleInputChange(index, "allergies", e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg p-3"
                                                placeholder="List any allergies"
                                            />
                                        </div>
    
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {t.pastMedical}
                                            </label>
                                            <textarea
                                                value={participant.pastMedicalHistory}
                                                onChange={(e) => handleInputChange(index, "pastMedicalHistory", e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg p-3"
                                                rows={2}
                                                placeholder="Describe any past medical conditions"
                                            ></textarea>
                                        </div>
    
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {t.currentMeds}
                                            </label>
                                            <input
                                                type="text"
                                                value={participant.currentMedications}
                                                onChange={(e) => handleInputChange(index, "currentMedications", e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg p-3"
                                                placeholder="List current medications"
                                            />
                                        </div>
    
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {t.familyMedical}
                                            </label>
                                            <textarea
                                                value={participant.familyMedicalHistory}
                                                onChange={(e) => handleInputChange(index, "familyMedicalHistory", e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg p-3"
                                                rows={2}
                                                placeholder="Any relevant family medical history"
                                            ></textarea>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
    
                    <button
                        onClick={addParticipant}
                        className="w-full mb-4 border-2 border-dashed border-blue-300 text-blue-500 py-3 rounded-xl font-medium flex items-center justify-center"
                    >
                        <Plus size={20} className="mr-2" />
                        {t.addParticipant}
                    </button>
    
                    <button
                        onClick={() => setCurrentScreen("form3")}
                        className={`w-full ${canProceed() ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-500"} py-3 rounded-xl font-medium mb-6`}
                        disabled={!canProceed()}
                    >
                        {t.next}
                    </button>
                </div>
                {renderBottomNav()}
            </div>
        );
    };

    const Form3Screen = () => {
        const [termsAgreed, setTermsAgreed] = useState(false);
    
        const handleSubmit = () => {
            if (isLoggedIn) {
              // Create a pending screening
              const newScreening = {
                id: `IJN${Date.now()}`,
                participants: [...participants],
                location: "Baratha Hotel", 
                date: "15 May 2023",
                time: "04:30 AM",
                status: "pending",
                total: 50000 * participants.length + 5000
              };
              
              setScreeningData([...screeningData, newScreening]);
              setSelectedScreeningId(newScreening.id);
              console.log(participants);
              
              setCurrentScreen("form5");
            } else {
              setShowLoginPopup(true);
            }
        };   
        return (
            <div className="min-h-screen bg-gray-50 pb-20">
                <div className="bg-white p-4 flex items-center shadow-sm">
                    <button
                        onClick={() => setCurrentScreen("form2")}
                        className="mr-2"
                    >
                        <ArrowLeft size={24} className="text-gray-800" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">{t.summary}</h1>
                </div>
    
                <div className="p-6">
                    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                        <h2 className="font-bold text-lg mb-4 text-gray-800">
                            {t.screeningDetails}
                        </h2>
    
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-3">
                            <span className="text-gray-700">{t.location}</span>
                            <span className="font-medium">Baratha Hotel</span>
                        </div>
    
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-3">
                            <span className="text-gray-700">{t.date}</span>
                            <span className="font-medium">15 May 2023</span>
                        </div>
    
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-3">
                            <span className="text-gray-700">{t.time}</span>
                            <span className="font-medium">04:30 AM - 10:00 AM</span>
                        </div>
    
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-3">
                            <span className="text-gray-700">{t.participants}</span>
                            <span className="font-medium">
                                {participants.length}
                            </span>
                        </div>
    
                        <h2 className="font-bold text-lg my-4 text-gray-800">
                            {t.payment}
                        </h2>
    
                        <div className="space-y-3 mb-4">
                            <div
                                className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer"
                                onClick={() => setSelectedPaymentMethod("bank")}
                            >
                                <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center mr-3">
                                    {selectedPaymentMethod === "bank" && (
                                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium">
                                        {t.bankTransfer}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {t.manualVerification}
                                    </p>
                                </div>
                            </div>
    
                            <div
                                className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer"
                                onClick={() => setSelectedPaymentMethod("card")}
                            >
                                <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center mr-3">
                                    {selectedPaymentMethod === "card" && (
                                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium">
                                        {t.creditDebitCard}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {t.instantVerification}
                                    </p>
                                </div>
                            </div>
    
                            <div
                                className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer"
                                onClick={() => setSelectedPaymentMethod("ewallet")}
                            >
                                <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center mr-3">
                                    {selectedPaymentMethod === "ewallet" && (
                                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium">{t.eWallet}</h3>
                                    <p className="text-xs text-gray-500">
                                        {t.instantVerification}
                                    </p>
                                </div>
                            </div>
                        </div>
    
                        <div className="border-t border-gray-200 pt-4 mb-4">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-700">
                                    {t.screeningFee}
                                </span>
                                <span>Rp 50,000 x {participants.length}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-700">
                                    {t.serviceFee}
                                </span>
                                <span>Rp 5,000</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg mt-4">
                                <span>{t.total}</span>
                                <span>Rp {50000 * participants.length + 5000}</span>
                            </div>
                        </div>
                        
                        {/* Terms and Conditions Agreement Checkbox */}
                        <div className="mb-4 mt-6">
                            <div 
                                className="flex items-start cursor-pointer"
                                onClick={() => setTermsAgreed(!termsAgreed)}
                            >
                                <div className="flex items-center h-5">
                                    <input
                                        type="checkbox"
                                        checked={termsAgreed}
                                        onChange={() => setTermsAgreed(!termsAgreed)}
                                        className="w-4 h-4 border border-gray-300 rounded accent-blue-500"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label className="text-gray-700">
                                        {language === "en" ? "I agree to the " : 
                                         language === "id" ? "Saya menyetujui " : 
                                         "我同意 "}
                                        <button 
                                            className="text-blue-500 hover:underline"
                                        >
                                            {t.terms}
                                        </button>
                                        {language === "en" ? " and " : 
                                         language === "id" ? " dan " : 
                                         " 和 "}
                                        <button 
                                            className="text-blue-500 hover:underline"
                                        >
                                            {t.privacy}
                                        </button>
                                    </label>
                                </div>
                            </div>
                        </div>
    
                        <button
                            onClick={() => {
                                if (isLoggedIn && termsAgreed) {
                                    handleSubmit();
                                } else if (!termsAgreed) {
                                    // Show an alert or toast notification if terms are not agreed
                                    alert(language === "en" ? "Please agree to the terms and conditions" : 
                                          language === "id" ? "Harap setujui syarat dan ketentuan" : 
                                          "请同意条款和条件");
                                } else {
                                    setShowLoginPopup(true);
                                }
                            }}
                            className={`w-full ${termsAgreed ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-500"} py-3 rounded-xl font-medium`}
                        >
                            {t.submit}
                        </button>
                    </div>
                </div>
                {renderBottomNav()}
            </div>
        );
    };

    const Form4Screen = () => (
        <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
            <div className="bg-white p-4 flex items-center shadow-sm">
                <h1 className="text-xl font-bold text-gray-800 flex-1 text-center">
                    {t.confirmationTitle}
                </h1>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                    <CheckCircle size={48} className="text-blue-500" />
                </div>

                <h2 className="font-bold text-2xl text-gray-800 mb-2">
                    {t.screeningSubmitted}
                </h2>
                <p className="text-gray-600 mb-8">{t.completePayment}</p>

                <div className="bg-white rounded-xl shadow-sm p-4 mb-6 w-full">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-700">{t.amount}</span>
                        <span className="font-bold text-xl">
                            Rp {50000 * participants.length + 5000}
                        </span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-3">
                        <span className="text-gray-700">{t.referenceId}</span>
                        <span className="font-medium">IJN230515001</span>
                    </div>
                </div>

                <button
                    onClick={() => setCurrentScreen("form5")}
                    className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium mb-3"
                >
                    <DollarSign size={18} className="inline mr-2" />
                    {t.proceedToPayment}
                </button>

                <button
                    onClick={() => setCurrentScreen("home")}
                    className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-medium"
                >
                    {t.backToHome}
                </button>
            </div>
            {renderBottomNav()}
        </div>
    );

    const Form5Screen = () => (
        <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
            <div className="bg-white p-4 flex items-center shadow-sm">
                <button
                    onClick={() => setCurrentScreen("form4")}
                    className="mr-2"
                >
                    <ArrowLeft size={24} className="text-gray-800" />
                </button>
                <h1 className="text-xl font-bold text-gray-800">{t.payment}</h1>
            </div>

            <div className="p-6">
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <h2 className="font-bold text-lg mb-4 text-gray-800">
                        {t.paymentDetails}
                    </h2>

                    <div className="p-4 bg-blue-50 rounded-lg mb-4">
                        <h3 className="font-medium mb-2">
                            {t.bankTransferInstructions}
                        </h3>
                        <ol className="text-sm text-gray-700 space-y-2 pl-5 list-decimal">
                            <li>{t.transferAmount}</li>
                            <li>{t.includeReference}</li>
                            <li>{t.completeWithin}</li>
                            <li>{t.uploadReceipt}</li>
                        </ol>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-3">
                        <span className="text-gray-700">{t.bank}</span>
                        <span className="font-medium">
                            Bank Central Asia (BCA)
                        </span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-3">
                        <span className="text-gray-700">{t.accountNumber}</span>
                        <div className="flex items-center">
                            <span className="font-medium mr-2">1234567890</span>
                            <button className="text-blue-500 text-xs">
                                {t.copy}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-3">
                        <span className="text-gray-700">{t.accountName}</span>
                        <span className="font-medium">
                            Ijen Health Services
                        </span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-3">
                        <span className="text-gray-700">{t.amount}</span>
                        <div className="flex items-center">
                            <span className="font-medium mr-2">
                                Rp {50000 * participants.length + 5000}
                            </span>
                            <button className="text-blue-500 text-xs">
                                {t.copy}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-3">
                        <span className="text-gray-700">{t.referenceId}</span>
                        <div className="flex items-center">
                            <span className="font-medium mr-2">
                                IJN230515001
                            </span>
                            <button className="text-blue-500 text-xs">
                                {t.copy}
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={() => setCurrentScreen("form6")}
                        className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium"
                    >
                        {t.confirmPayment}
                    </button>
                </div>
            </div>
            {renderBottomNav()}
        </div>
    );

    const Form6Screen = () => {
        useEffect(() => {
            // Create a new screening record when this screen loads
            if (!selectedScreeningId) {
              const newScreening = {
                id: `IJN${Date.now()}`,
                participants: [...participants],
                location: "Baratha Hotel",
                date: "15 May 2023",
                time: "04:30 AM",
                status: "complete",
                total: 50000 * participants.length + 5000
              };
              
              setScreeningData([...screeningData, newScreening]);
              setSelectedScreeningId(newScreening.id);
            }
          }, []);
          return (
              <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
                          <CheckCircle size={48} className="text-green-500" />
                      </div>
      
                      <h2 className="font-bold text-2xl text-gray-800 mb-2">
                          {t.paymentSuccessful}
                      </h2>
                      <p className="text-gray-600 mb-8">{t.healthConfirmed}</p>
      
                      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 w-full">
                          <div className="flex justify-between items-center mb-2">
                              <span className="text-gray-700">{t.location}</span>
                              <span className="font-medium">Baratha Hotel</span>
                          </div>
      
                          <div className="flex justify-between items-center mb-2">
                              <span className="text-gray-700">{t.date}</span>
                              <span className="font-medium">15 May 2023</span>
                          </div>
      
                          <div className="flex justify-between items-center mb-2">
                              <span className="text-gray-700">{t.time}</span>
                              <span className="font-medium">04:30 AM</span>
                          </div>
      
                          <div className="flex justify-between items-center mb-2">
                              <span className="text-gray-700">{t.participants}</span>
                              <span className="font-medium">
                                  {participants.length}
                              </span>
                          </div>
      
                          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                              <div className="flex items-start">
                                  <AlertCircle
                                      size={18}
                                      className="text-green-600 mr-2 mt-0.5 flex-shrink-0"
                                  />
                                  <p className="text-sm text-green-800">
                                      {t.arriveEarly}
                                  </p>
                              </div>
                          </div>
                      </div>
      
                      <button
                          onClick={() => setCurrentScreen("viewTicket")}
                          className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium mb-3"
                          >
                      {t.viewETicket}
                      </button>
      
                      <button
                          onClick={() => setCurrentScreen("form1")}
                          className="text-blue-500 font-medium"
                          >
                          {t.backToHome}
                      </button>
                  </div>
                  {renderBottomNav()}
              </div>
          );
    }

    const DetailScreen = () => {
        const screening = screeningData.find(item => item.id === selectedScreeningId);
        
        if (!screening) {
          return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <div className="bg-white p-4 flex items-center shadow-sm">
                <button onClick={() => setCurrentScreen("screening")} className="mr-2">
                  <ArrowLeft size={24} className="text-gray-800" />
                </button>
                <h1 className="text-xl font-bold text-gray-800">{t.screeningDetails}</h1>
              </div>
              
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center">
                  <AlertCircle size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-800 mb-2">
                    {language === "en" ? "Screening not found" : 
                     language === "id" ? "Pemeriksaan tidak ditemukan" : 
                     "未找到筛查记录"}
                  </h3>
                  <button 
                    onClick={() => setCurrentScreen("screening")}
                    className="text-blue-500 text-sm font-medium"
                  >
                    {language === "en" ? "Go back" : 
                     language === "id" ? "Kembali" : 
                     "返回"}
                  </button>
                </div>
              </div>
            </div>
          );
        }
        
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="bg-white p-4 flex items-center shadow-sm">
              <button onClick={() => setCurrentScreen("screening")} className="mr-2">
                <ArrowLeft size={24} className="text-gray-800" />
              </button>
              <h1 className="text-xl font-bold text-gray-800">{t.screeningDetails}</h1>
            </div>
      
            <div className="p-6">
              <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{screening.location}</h3>
                      <p className="text-xs text-gray-500">{screening.date}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full ${screening.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"} text-xs font-medium`}>
                    {screening.status === "pending" ? t.pending : t.complete}
                  </div>
                </div>
      
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">{t.referenceId}</span>
                    <span className="font-medium">{screening.id}</span>
                  </div>
      
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">{t.date}</span>
                    <span className="font-medium">{screening.date}</span>
                  </div>
      
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">{t.time}</span>
                    <span className="font-medium">{screening.time}</span>
                  </div>
      
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">{t.status}</span>
                    <span className={`font-medium ${screening.status === "pending" ? "text-yellow-600" : "text-green-600"}`}>
                      {screening.status === "pending" ? t.pending : t.complete}
                    </span>
                  </div>
                </div>
      
                <h3 className="font-medium text-gray-800 mb-3">
                  {t.participants} ({screening.participants.length})
                </h3>
      
                {screening.participants.map((participant, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700">
                        {participant.title || 'Mr'}.{' '}
                        {participant.name || 'Unnamed Participant'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {participant.age || 'N/A'} years
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {participant.hasMedicalHistory ? 
                        (participant.allergies ? `Allergies: ${participant.allergies}` : "Has medical history") : 
                        "No medical history"}
                    </p>
                  </div>
                ))}
      
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">{t.screeningFee}</span>
                    <span>Rp 50,000 x {screening.participants.length}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">{t.serviceFee}</span>
                    <span>Rp 5,000</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-4">
                    <span>{t.total}</span>
                    <span>Rp {50000 * screening.participants.length + 5000}</span>
                  </div>
                </div>
      
                {screening.status === "pending" && (
                  <button
                    onClick={() => {
                      setSelectedScreeningId(screening.id);
                      setCurrentScreen("form4");
                    }}
                    className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium"
                  >
                    {t.continueToPayment}
                  </button>
                )}
                
                {screening.status === "complete" && (
                  <button
                    onClick={() => {
                      setSelectedScreeningId(screening.id);
                      setCurrentScreen("viewTicket");
                    }}
                    className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium"
                  >
                    {t.viewETicket}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      };
      

    const PartnerScreen = () => (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white p-4 flex items-center shadow-sm">
                <button
                    onClick={() => setCurrentScreen("location")}
                    className="mr-2"
                >
                    <ArrowLeft size={24} className="text-gray-800" />
                </button>
                <h1 className="text-xl font-bold text-gray-800">{t.partner}</h1>
            </div>

            <div className="p-6">
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <h2 className="font-bold text-lg mb-4 text-gray-800">
                        {t.becomePartnerText}
                    </h2>

                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.businessName}
                            </label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg p-3"
                                placeholder="Enter your business name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.businessType}
                            </label>
                            <select className="w-full border border-gray-300 rounded-lg p-3">
                                <option>Tour Guide</option>
                                <option>Tour Operator</option>
                                <option>Transportation Provider</option>
                                <option>Accommodation</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.contactPerson}
                            </label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg p-3"
                                placeholder="Full name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.emailAddress}
                            </label>
                            <input
                                type="email"
                                className="w-full border border-gray-300 rounded-lg p-3"
                                placeholder="email@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.phoneNumber}
                            </label>
                            <input
                                type="tel"
                                className="w-full border border-gray-300 rounded-lg p-3"
                                placeholder="+62..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.businessAddress}
                            </label>
                            <textarea
                                className="w-full border border-gray-300 rounded-lg p-3"
                                rows={3}
                                placeholder="Enter your business address"
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.whyPartner}
                            </label>
                            <textarea
                                className="w-full border border-gray-300 rounded-lg p-3"
                                rows={3}
                                placeholder={t.partnerInterest}
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.businessLicense}
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                                    <Upload
                                        size={24}
                                        className="text-blue-500"
                                    />
                                </div>
                                <p className="text-sm text-gray-500 text-center mb-2">
                                    {t.uploadInstructions}
                                </p>
                                <p className="text-xs text-gray-400 text-center">
                                    {t.fileTypes}
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setCurrentScreen("home")}
                        className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium"
                    >
                        {t.submitApplication}
                    </button>
                </div>
            </div>
        </div>
    );

    const ReceiptScreen = () => {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="bg-white p-4 flex items-center shadow-sm">
                    <button
                        onClick={() => setCurrentScreen("form6")}
                        className="mr-2"
                    >
                        <ArrowLeft size={24} className="text-gray-800" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">
                        {t.eTicket}
                    </h1>
                    <button
                        onClick={() => setCurrentScreen("viewTicket")}
                        className="ml-auto text-blue-500"
                    >
                        <Eye size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="font-bold text-lg text-gray-800">
                                    {t.healthPass}
                                </h2>
                                <p className="text-xs text-gray-500">
                                    {t.eTicketSubtitle}
                                </p>
                            </div>
                            <div className="w-16 h-16">
                                <Activity size={24} className="text-blue-500" />
                            </div>
                        </div>

                        <div className="border-t border-b border-dashed border-gray-200 py-4 mb-4">
                            <div className="flex justify-center mb-4">
                                <div className="p-2 bg-white rounded-lg border border-gray-200">
                                    <img
                                        src="https://docs.lightburnsoftware.com/legacy/img/QRCode/ExampleCode.png"
                                        alt="QR Code"
                                        className="w-32 h-32"
                                    />
                                </div>
                            </div>
                            <p className="text-center text-sm text-gray-500 mb-1">
                                {t.referenceId}
                            </p>
                            <p className="text-center font-bold text-lg">
                                IJN230515001
                            </p>
                        </div>

                        <div className="space-y-3 mb-5">
                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                    {t.location}
                                </span>
                                <span className="font-medium">
                                    Baratha Hotel
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">{t.date}</span>
                                <span className="font-medium">15 May 2023</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">{t.time}</span>
                                <span className="font-medium">04:30 AM</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                    {t.status}
                                </span>
                                <span className="font-medium text-green-600">
                                    {t.confirmed}
                                </span>
                            </div>
                        </div>

                        <h3 className="font-medium text-gray-800 mb-2">
                            {t.participants}
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-3 mb-2">
                            <div className="flex justify-between">
                                <span className="font-medium">
                                    Mr. Arif Hassan
                                </span>
                                <span className="text-sm text-gray-500">
                                    35 years
                                </span>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                            <div className="flex justify-between">
                                <span className="font-medium">
                                    Mrs. Sarah Lee
                                </span>
                                <span className="text-sm text-gray-500">
                                    32 years
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <p className="text-xs text-gray-500 mb-2">
                                {t.arriveEarly}
                            </p>
                            <p className="text-xs text-gray-500">
                                {t.showTicket}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => setCurrentScreen("viewTicket")}
                            className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium"
                        >
                            <Eye size={18} className="inline mr-2" />
                            {t.viewETicket}
                        </button>

                        <button
                            onClick={() => setCurrentScreen("home")}
                            className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-medium"
                        >
                            {t.backToHome}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const ViewTicketScreen = () => {
        const screening = screeningData.find(item => item.id === selectedScreeningId);
  
        if (screening) {
            return (
                <div className="min-h-screen bg-blue-600">
                    <div className="bg-white p-4 flex items-center shadow-sm">
                        <button
                            onClick={() => setCurrentScreen("form6")}
                            className="mr-2"
                        >
                            <ArrowLeft size={24} className="text-gray-800" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-800">{t.eTicket}</h1>
                        <button
                            onClick={() => window.print()}
                            className="ml-auto text-blue-500"
                        >
                            <Download size={20} />
                        </button>
                    </div>
        
                    <div className="p-6">
                        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                            <div className="bg-blue-500 p-5 text-white">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="font-bold text-xl">
                                            {t.healthPass}
                                        </h2>
                                        <p className="text-sm opacity-90">
                                            {t.healthConfirmation}
                                        </p>
                                    </div>
                                    <Activity size={28} />
                                </div>
                            </div>
        
                            <div className="p-5">
                                <div className="flex justify-center mb-6">
                                    <div className="p-3 bg-white rounded-lg shadow-md border border-gray-200">
                                        <img
                                            src="https://docs.lightburnsoftware.com/legacy/img/QRCode/ExampleCode.png"
                                            alt="QR Code"
                                            className="w-48 h-48"
                                        />
                                    </div>
                                </div>
        
                                <div className="text-center mb-6">
                                    <p className="text-sm text-gray-500">
                                        {t.referenceId}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        IJN230515001
                                    </p>
                                </div>
        
                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center">
                                        <MapPin
                                            size={20}
                                            className="text-blue-500 mr-3"
                                        />
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                {t.location}
                                            </p>
                                            <p className="font-medium">Baratha Hotel</p>
                                        </div>
                                    </div>
        
                                    <div className="flex items-center">
                                        <Calendar
                                            size={20}
                                            className="text-blue-500 mr-3"
                                        />
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                {t.date}
                                            </p>
                                            <p className="font-medium">15 May 2023</p>
                                        </div>
                                    </div>
        
                                    <div className="flex items-center">
                                        <Clock
                                            size={20}
                                            className="text-blue-500 mr-3"
                                        />
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                {t.time}
                                            </p>
                                            <p className="font-medium">04:30 AM</p>
                                        </div>
                                    </div>
                                </div>
        
                                <div className="border-t border-dashed border-gray-200 pt-4">
                                    <h3 className="font-medium text-gray-800 mb-3">
                                        {t.participants}
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                                                <User
                                                    size={16}
                                                    className="text-gray-600"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-medium">
                                                    Mr. Arif Hassan
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    35 years
                                                </p>
                                            </div>
                                        </div>
        
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                                                <User
                                                    size={16}
                                                    className="text-gray-600"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-medium">
                                                    Mrs. Sarah Lee
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    32 years
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
        
                                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100">
                                    <div className="flex">
                                        <CheckCircle
                                            size={20}
                                            className="text-green-500 mr-2 flex-shrink-0"
                                        />
                                        <p className="text-sm text-green-800">
                                            {t.showTicket}
                                        </p>
                                    </div>
                                </div>
                            </div>
        
                            <div className="bg-gray-50 p-4 border-t border-gray-200">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            {t.issuedBy}
                                        </p>
                                        <p className="text-sm font-medium text-gray-800">
                                            {t.issuingOrg}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">
                                            {t.status}
                                        </p>
                                        <p className="text-sm font-medium text-green-600">
                                            {t.confirmed}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }      
    }

    const VideoPopup = () => (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl overflow-hidden">
                <div className="p-4 flex justify-between items-center border-b border-gray-200">
                    <h3 className="font-bold text-lg">
                        {t.ijenCraterExperience}
                    </h3>
                    <button
                        onClick={() => setShowVideoPopup(false)}
                        className="p-2 rounded-full hover:bg-gray-100"
                    >
                        <X size={24} className="text-gray-600" />
                    </button>
                </div>
                <div className="relative h-[50vh]">
                    <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src="https://www.youtube.com/embed/eq1Lu4Lr19Y"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </div>
    );

    return (
        <div className="font-sans">
            <Head title="Online Submission" />

            {currentScreen === "onboarding" && <OnboardingScreen />}
            {currentScreen === "login" && <LoginScreen />}
            {currentScreen === "home" && <HomeScreen />}
            {currentScreen === "screening" && <ScreeningScreen />}
            {currentScreen === "location" && <LocationScreen />}
            {currentScreen === "profile" && <ProfileScreen />}
            {currentScreen === "form1" && <Form1Screen />}
            {currentScreen === "form2" && <Form2Screen />}
            {currentScreen === "form3" && <Form3Screen />}
            {currentScreen === "form4" && <Form4Screen />}
            {currentScreen === "form5" && <Form5Screen />}
            {currentScreen === "form6" && <Form6Screen />}
            {currentScreen === "details" && <DetailScreen />}
            {currentScreen === "partner" && <PartnerScreen />}
            {currentScreen === "receipt" && <ReceiptScreen />}
            {currentScreen === "viewTicket" && <ViewTicketScreen />}
            {showLoginPopup && <LoginPopup />}
            {showVideoPopup && <VideoPopup />}
        </div>
    );
};

export default App;