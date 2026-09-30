/**
 * RUNA Wellness Centre - Seed Data with Granular Sub-Tasks, Manual Deadlines & Bottleneck Logs
 * 12 Contract Manufacturing (Maklon) Products
 */

const INITIAL_STAGES = [
  { id: 'rebranding', name: 'Penentuan Nama & Rebranding', color: '#EC4899', icon: 'fa-tag' },
  { id: 'riset', name: 'Riset & Formulasi (Bahan/Aroma/Kemasan)', color: '#8B5CF6', icon: 'fa-vial' },
  { id: 'uji_lab', name: 'Uji Laboratorium (Max 2 Bln)', color: '#3B82F6', icon: 'fa-flask' },
  { id: 'bpom_halal', name: 'Perijinan BPOM TR & Halal', color: '#F59E0B', icon: 'fa-certificate' },
  { id: 'kemasan', name: 'Desain & Packaging Ready', color: '#10B981', icon: 'fa-box-open' },
  { id: 'ready_prod', name: 'Ready to Produce / Launch', color: '#059669', icon: 'fa-rocket' }
];

const INITIAL_WAVES = [
  { id: 'wave1', name: 'Wave 1 (Quick Wins)', description: 'Bahan Baku Ready / Tinggal Rebranding & Process Ijin' },
  { id: 'wave2', name: 'Wave 2 (Mid-Term R&D)', description: 'Bahan Sebagian Ready / Riset Filler & Formulasi Baru' },
  { id: 'wave3', name: 'Wave 3 (Long-Term R&D)', description: 'Full R&D Bahan Baku & Sourcing Pihak Ketiga' }
];

const INITIAL_PICS = [
  { id: 'pt_agro', name: 'PT Agro Sehat Nusantara', badgeClass: 'badge-agro' },
  { id: 'pihak_3', name: 'Supplier Pihak Ke-3', badgeClass: 'badge-pihak3' },
  { id: 'pt_runa', name: 'Internal RUNA Wellness', badgeClass: 'badge-runa' },
  { id: 'joint', name: 'Joint Team (PT Agro & Pihak 3)', badgeClass: 'badge-joint' }
];

const INITIAL_PRODUCTS = [
  {
    id: 'prod-aura',
    name: 'AURA (Ganti Nama)',
    code: 'RN-AUR-01',
    wave: 'wave1',
    stage: 'rebranding',
    pic: 'pt_runa',
    rawMaterialStatus: 'Ready 100%',
    researchFocus: 'Ganti nama merek & registrasi HKI',
    startDate: '2026-10-01',
    estCompletionDate: '2027-05-30',
    riskLevel: 'medium',
    bottleneck: 'Penentuan nama pengganti AURA belum disetujui Owner',
    notes: 'Bahan baku dari Aura juga digunakan untuk turunan produk Obat Sariawan.',
    bottleneckLog: {
      rootCause: 'Owner meminta 3 opsi alternatif nama tambahan yang memiliki filosofi kebugaran alam',
      actionPlan: 'PM menyiapkan 3 opsi nama baru + riset awal ketersediaan domain & HKI untuk diserahkan ke Owner',
      status: 'in_progress',
      targetResolveDate: '2026-10-15'
    },
    tasks: [
      { id: 't-aur-1', title: 'Penyusunan 3 Usulan Nama Baru AURA', category: 'rebranding', completed: true, deadline: '2026-10-05', pic: 'pt_runa' },
      { id: 't-aur-2', title: 'Pengecekan Database HKI / PDKI Kemenkumham', category: 'rebranding', completed: true, deadline: '2026-10-10', pic: 'pt_runa' },
      { id: 't-aur-3', title: 'Persetujuan (ACC) Nama Baru dari Owner', category: 'rebranding', completed: false, deadline: '2026-10-18', pic: 'pt_runa' },
      { id: 't-aur-4', title: 'Pencetakan Label Sampel Uji Lab dengan Nama Baru', category: 'uji_lab', completed: false, deadline: '2026-11-15', pic: 'pt_agro' },
      { id: 't-aur-5', title: 'Pendaftaran Berkas e-BPOM TR', category: 'bpom_halal', completed: false, deadline: '2027-01-10', pic: 'pt_agro' },
      { id: 't-aur-6', title: 'Audit Dokumentasi SJPH Sertifikasi Halal', category: 'bpom_halal', completed: false, deadline: '2027-02-28', pic: 'pt_agro' }
    ]
  },
  {
    id: 'prod-skinbio',
    name: 'SkinBio',
    code: 'RN-SKB-02',
    wave: 'wave1',
    stage: 'riset',
    pic: 'joint',
    rawMaterialStatus: 'Ready 100%',
    researchFocus: 'Riset variasi aroma (Pihak Ke-3 & PT Agro)',
    startDate: '2026-10-05',
    estCompletionDate: '2027-06-15',
    riskLevel: 'low',
    bottleneck: 'Menunggu pengiriman sampel aroma pilihan ke-3 dari Supplier Pihak Ketiga',
    notes: 'Bahan baku sudah siap di gudang, tinggal finalisasi aroma pilihan.',
    bottleneckLog: {
      rootCause: 'Pengiriman kurir ekstrak aroma alami dari supplier Pihak 3 membutuhkan waktu 5 hari kerja',
      actionPlan: 'Follow up nomor resi pengiriman & siapkan form pengujian organoleptik bersama PT Agro',
      status: 'in_progress',
      targetResolveDate: '2026-10-12'
    },
    tasks: [
      { id: 't-skb-1', title: 'Penyediaan Bahan Baku Utama di Gudang', category: 'riset', completed: true, deadline: '2026-09-30', pic: 'pihak_3' },
      { id: 't-skb-2', title: 'Trial Formulasi Aroma Varian 1 & 2', category: 'riset', completed: true, deadline: '2026-10-05', pic: 'pt_agro' },
      { id: 't-skb-3', title: 'Pengiriman & Uji Organoleptik Sampel Aroma Varian 3', category: 'riset', completed: false, deadline: '2026-10-15', pic: 'joint' },
      { id: 't-skb-4', title: 'Finalisasi Formula & Penyerahan Sampel ke Uji Lab', category: 'uji_lab', completed: false, deadline: '2026-11-01', pic: 'pt_agro' },
      { id: 't-skb-5', title: 'Pengurusan Pendaftaran BPOM TR (6 Bulan)', category: 'bpom_halal', completed: false, deadline: '2027-04-30', pic: 'pt_agro' },
      { id: 't-skb-6', title: 'Final Proof Print Mockup Kemasan Botol', category: 'kemasan', completed: false, deadline: '2027-05-15', pic: 'pt_runa' }
    ]
  },
  {
    id: 'prod-lumbio-kids',
    name: 'Lumbio Kids',
    code: 'RN-LBK-03',
    wave: 'wave1',
    stage: 'riset',
    pic: 'pt_agro',
    rawMaterialStatus: 'Ready 100%',
    researchFocus: 'Riset bahan pengisi (filler) Tablet Hisap',
    startDate: '2026-10-01',
    estCompletionDate: '2027-06-30',
    riskLevel: 'low',
    bottleneck: 'Uji daya hisap & kelarutan filler tablet pada rasa buah anak',
    notes: 'Produk ditargetkan untuk anak-anak, rasa & tekstur hisap sangat vital.',
    bottleneckLog: {
      rootCause: 'Formulasi filler awal terlalu keras untuk daya hisap anak-anak',
      actionPlan: 'PT Agro menyesuaikan rasio mannitol & sorbitol agar tablet lebih lembut saat dihisap',
      status: 'in_progress',
      targetResolveDate: '2026-10-25'
    },
    tasks: [
      { id: 't-lbk-1', title: 'Verifikasi Ketersediaan Aktif Ekstrak Cacing/Herbal', category: 'riset', completed: true, deadline: '2026-09-25', pic: 'pt_agro' },
      { id: 't-lbk-2', title: 'Trial Formulasi Filler Tablet Hisap (Rasa Strawberry & Jeruk)', category: 'riset', completed: false, deadline: '2026-10-20', pic: 'pt_agro' },
      { id: 't-lbk-3', title: 'Uji Kekerasan & Keregasan Tablet (Friability Test)', category: 'uji_lab', completed: false, deadline: '2026-11-10', pic: 'pt_agro' },
      { id: 't-lbk-4', title: 'Uji Stabilitas & Mikrobiologi 2 Bulan', category: 'uji_lab', completed: false, deadline: '2027-01-10', pic: 'pt_agro' },
      { id: 't-lbk-5', title: 'Submit Berkas BPOM TR Kategori Herbal Anak', category: 'bpom_halal', completed: false, deadline: '2027-02-01', pic: 'pt_agro' }
    ]
  },
  {
    id: 'prod-cellbio',
    name: 'Cellbio',
    code: 'RN-CLB-04',
    wave: 'wave1',
    stage: 'uji_lab',
    pic: 'pt_agro',
    rawMaterialStatus: 'Ready 100%',
    researchFocus: 'Sudah siap -> Penyiapan sampel Uji Lab',
    startDate: '2026-09-15',
    estCompletionDate: '2027-05-15',
    riskLevel: 'low',
    bottleneck: 'Menunggu slot antrean pengujian laboratorium independen',
    notes: 'Kandidat tercepat untuk registrasi BPOM TR.',
    bottleneckLog: {
      rootCause: 'Antrean kuota uji laboratorium uji tercemar sedang padat',
      actionPlan: 'Melakukan klaim percepatan slot pengujian melalui mitra lab PT Agro',
      status: 'in_progress',
      targetResolveDate: '2026-10-18'
    },
    tasks: [
      { id: 't-clb-1', title: 'Finalisasi Formulasi Cellbio 100%', category: 'riset', completed: true, deadline: '2026-09-10', pic: 'pt_agro' },
      { id: 't-clb-2', title: 'Penyerahan Berkas CoA Bahan Baku ke Lab', category: 'uji_lab', completed: true, deadline: '2026-09-20', pic: 'pt_agro' },
      { id: 't-clb-3', title: 'Pengujian Mikrobiologi & Logam Berat Lab Eksternal', category: 'uji_lab', completed: false, deadline: '2026-10-25', pic: 'pt_agro' },
      { id: 't-clb-4', title: 'Submission e-BPOM Registrasi Izin Edar TR', category: 'bpom_halal', completed: false, deadline: '2026-11-15', pic: 'pt_agro' },
      { id: 't-clb-5', title: 'Verifikasi Halal MUI & BPJPH', category: 'bpom_halal', completed: false, deadline: '2027-01-20', pic: 'pt_agro' }
    ]
  },
  {
    id: 'prod-habbats',
    name: 'Habbats (Ganti Nama)',
    code: 'RN-HBT-05',
    wave: 'wave1',
    stage: 'rebranding',
    pic: 'pt_runa',
    rawMaterialStatus: 'Ready 100%',
    researchFocus: 'Ganti nama merek baru & bahan baku siap',
    startDate: '2026-10-01',
    estCompletionDate: '2027-06-01',
    riskLevel: 'medium',
    bottleneck: 'Pencarian nama pengganti Habbats agar tidak bentrok dengan merek terdaftar lain',
    notes: 'Bahan baku Habbatussauda premium sudah terkunci.',
    bottleneckLog: {
      rootCause: 'Banyak nama variasi Habbats yang sudah terdaftar di kelas barang 05 HKI',
      actionPlan: 'Konsultasi konsultan HKI untuk menggunakan penamaan khas RUNA (misal: RunaHabbat / HabbaBio)',
      status: 'in_progress',
      targetResolveDate: '2026-10-20'
    },
    tasks: [
      { id: 't-hbt-1', title: 'Riset Nama Pengganti Habbats & Cek PDKI', category: 'rebranding', completed: true, deadline: '2026-10-05', pic: 'pt_runa' },
      { id: 't-hbt-2', title: 'Persetujuan Nama Merek oleh Owner', category: 'rebranding', completed: false, deadline: '2026-10-15', pic: 'pt_runa' },
      { id: 't-hbt-3', title: 'Pembuatan Mockup Label Botol Herbal', category: 'kemasan', completed: false, deadline: '2026-11-05', pic: 'pt_runa' },
      { id: 't-hbt-4', title: 'Penyiapan Berkas Izin Edar BPOM TR', category: 'bpom_halal', completed: false, deadline: '2026-12-01', pic: 'pt_agro' }
    ]
  },
  {
    id: 'prod-sariawan',
    name: 'Obat Sariawan (Ganti Nama)',
    code: 'RN-SRW-06',
    wave: 'wave1',
    stage: 'rebranding',
    pic: 'pt_runa',
    rawMaterialStatus: 'Ready (Basis Bahan AURA)',
    researchFocus: 'Rebranding & Penyesuaian Dosis Tetes/Semprot',
    startDate: '2026-10-05',
    estCompletionDate: '2027-06-15',
    riskLevel: 'medium',
    bottleneck: 'Penetapan klaim khasiat sariawan & penetapan nama komersial',
    notes: 'Menggunakan basis formulasi bahan baku AURA.',
    bottleneckLog: {
      rootCause: 'Perlu penetapan jenis sediaan akhir: Cairan Tetes Oral vs Liquid Spray Sariawan',
      actionPlan: 'Diskusi teknis dengan tim R&D PT Agro mengenai efektivitas nozzle spray vs dropper tetes',
      status: 'in_progress',
      targetResolveDate: '2026-10-22'
    },
    tasks: [
      { id: 't-srw-1', title: 'Penetapan Nama Pengganti Merek Obat Sariawan', category: 'rebranding', completed: false, deadline: '2026-10-18', pic: 'pt_runa' },
      { id: 't-srw-2', title: 'Keputusan Sediaan (Tetes vs Spray) dari Owner', category: 'riset', completed: false, deadline: '2026-10-25', pic: 'joint' },
      { id: 't-srw-3', title: 'Uji Stabilitas Cairan & Daya Simpan Botol Spray', category: 'uji_lab', completed: false, deadline: '2026-11-30', pic: 'pt_agro' }
    ]
  },
  {
    id: 'prod-vitbio-serbuk',
    name: 'Vitbio Serbuk',
    code: 'RN-VTS-07',
    wave: 'wave2',
    stage: 'riset',
    pic: 'joint',
    rawMaterialStatus: 'Perlu Diriset (Supplier Pihak 3)',
    researchFocus: 'Riset bahan baku & formulasi serbuk sachet',
    startDate: '2026-10-15',
    estCompletionDate: '2027-07-31',
    riskLevel: 'high',
    bottleneck: 'Sourcing ketersediaan bahan baku vitamin/herbal serbuk larut air',
    notes: 'Diminta oleh Owner untuk varian serbuk siap seduh.',
    bottleneckLog: {
      rootCause: 'Ekstrak bahan aktif alami cenderung menggumpal jika terpapar kelembapan',
      actionPlan: 'Supplier Pihak 3 melakukan micro-encapsulation pada bahan serbuk agar mudah larut & stabil',
      status: 'open',
      targetResolveDate: '2026-11-15'
    },
    tasks: [
      { id: 't-vts-1', title: 'Sourcing Supplier Bahan Baku Serbuk Larut Air', category: 'riset', completed: false, deadline: '2026-10-30', pic: 'pihak_3' },
      { id: 't-vts-2', title: 'Trial Mikro-Enkapsulasi & Uji Kelarutan Air Dingin', category: 'riset', completed: false, deadline: '2026-11-20', pic: 'joint' },
      { id: 't-vts-3', title: 'Penyesuaian Kemasan Sachet Aluminium Foil Kedap Udara', category: 'kemasan', completed: false, deadline: '2026-12-15', pic: 'pt_runa' }
    ]
  },
  {
    id: 'prod-vitbio-jelly',
    name: 'Vitbio Jelly / Tablet Hisap',
    code: 'RN-VTJ-08',
    wave: 'wave2',
    stage: 'riset',
    pic: 'joint',
    rawMaterialStatus: 'Perlu Diriset (Supplier Pihak 3)',
    researchFocus: 'Riset bahan baku & pilihan format (Jelly Stick vs Tablet Hisap)',
    startDate: '2026-10-15',
    estCompletionDate: '2027-08-15',
    riskLevel: 'high',
    bottleneck: 'Keputusan format sediaan: Jelly Stick atau Tablet Hisap',
    notes: 'Perlu analisis biaya produksi antara mesin jelly stick vs press tablet.',
    bottleneckLog: {
      rootCause: 'Investasi cetakan mesin jelly stick lebih tinggi dibanding mesin cetak tablet',
      actionPlan: 'PM menyusun perbandingan analisis COGS (Cost of Goods Sold) Jelly vs Tablet untuk Owner',
      status: 'open',
      targetResolveDate: '2026-11-10'
    },
    tasks: [
      { id: 't-vtj-1', title: 'Studi Kelayakan COGS Jelly Stick vs Tablet Hisap', category: 'riset', completed: false, deadline: '2026-10-28', pic: 'pt_runa' },
      { id: 't-vtj-2', title: 'Keputusan Format Sediaan oleh Owner', category: 'riset', completed: false, deadline: '2026-11-08', pic: 'pt_runa' },
      { id: 't-vtj-3', title: 'Trial Gelling Agent / Binder Tablet dengan PT Agro', category: 'riset', completed: false, deadline: '2026-12-05', pic: 'pt_agro' }
    ]
  },
  {
    id: 'prod-beemora',
    name: 'Beemora',
    code: 'RN-BMR-09',
    wave: 'wave1',
    stage: 'uji_lab',
    pic: 'pt_agro',
    rawMaterialStatus: 'Ready 100%',
    researchFocus: 'Bahan Baku Ada -> Uji Lab & Pengurusan BPOM',
    startDate: '2026-09-20',
    estCompletionDate: '2027-05-20',
    riskLevel: 'low',
    bottleneck: 'Kelengkapan berkas CoA bahan baku dari produsen asli',
    notes: 'Salah satu produk unggulan berbahan dasar produk lebah.',
    bottleneckLog: {
      rootCause: 'Dokumen analisis asal usul bahan lebah membutuhkan legalisasi terjemahan',
      actionPlan: 'Supplier Pihak 3 menyerahkan dokumen COA tersumpah ke tim registrasi PT Agro',
      status: 'in_progress',
      targetResolveDate: '2026-10-14'
    },
    tasks: [
      { id: 't-bmr-1', title: 'Pemeriksaan Mutu Bahan Madu/Propolis', category: 'riset', completed: true, deadline: '2026-09-15', pic: 'pihak_3' },
      { id: 't-bmr-2', title: 'Penyerahan Sampel Uji Logam Berat & Bebas Antibiotik', category: 'uji_lab', completed: true, deadline: '2026-09-28', pic: 'pt_agro' },
      { id: 't-bmr-3', title: 'Penerbitan Hasil Uji Lab Eksternal', category: 'uji_lab', completed: false, deadline: '2026-10-20', pic: 'pt_agro' },
      { id: 't-bmr-4', title: 'Upload Berkas Pendaftaran BPOM TR', category: 'bpom_halal', completed: false, deadline: '2026-11-10', pic: 'pt_agro' }
    ]
  },
  {
    id: 'prod-hepapro',
    name: 'Hepapro',
    code: 'RN-HPP-10',
    wave: 'wave2',
    stage: 'riset',
    pic: 'joint',
    rawMaterialStatus: 'Sebagian Ready (Perlu Ganti Filler)',
    researchFocus: 'Penggantian bahan pengisi (filler) agar lebih efisien',
    startDate: '2026-10-01',
    estCompletionDate: '2027-06-30',
    riskLevel: 'medium',
    bottleneck: 'Pengujian homogenitas filler baru dengan zat aktif Hepapro',
    notes: 'Bahan aktif utama sudah ada, hanya menyesuaikan bahan tambahan.',
    bottleneckLog: {
      rootCause: 'Filler lama sulit terurai sempurna dalam kapsul',
      actionPlan: 'Uji varian filler Microcrystalline Cellulose (MCC 102) di lab PT Agro',
      status: 'in_progress',
      targetResolveDate: '2026-10-30'
    },
    tasks: [
      { id: 't-hpp-1', title: 'Evaluasi Bahan Filler Lama Hepapro', category: 'riset', completed: true, deadline: '2026-09-28', pic: 'pt_agro' },
      { id: 't-hpp-2', title: 'Trial Formulasi Kapsul dengan Filler MCC 102', category: 'riset', completed: false, deadline: '2026-10-22', pic: 'pt_agro' },
      { id: 't-hpp-3', title: 'Uji Disintegrasi Kapsul (Waktu Hancur)', category: 'uji_lab', completed: false, deadline: '2026-11-15', pic: 'pt_agro' }
    ]
  },
  {
    id: 'prod-royal-bio',
    name: 'Royal Bio',
    code: 'RN-RYB-11',
    wave: 'wave3',
    stage: 'riset',
    pic: 'pihak_3',
    rawMaterialStatus: 'Masih Diriset Pihak Ke-3',
    researchFocus: 'Riset standarisasi ekstrak & pasokan bahan baku',
    startDate: '2026-11-01',
    estCompletionDate: '2027-09-30',
    riskLevel: 'high',
    bottleneck: 'Stabilitas & kontinuitas pasokan ekstrak murni dari Supplier Pihak 3',
    notes: 'Produk kategori premium R&D jangka panjang.',
    bottleneckLog: {
      rootCause: 'Ketersediaan bahan baku Royal Bio tergantung panen musim tanaman spesifik',
      actionPlan: 'Supplier Pihak 3 membuat kesepakatan kontrak pasokan minimal (MoU Supply Guarantee)',
      status: 'open',
      targetResolveDate: '2026-11-30'
    },
    tasks: [
      { id: 't-ryb-1', title: 'Uji Assay Efikasi & Standarisasi Ekstrak', category: 'riset', completed: false, deadline: '2026-11-15', pic: 'pihak_3' },
      { id: 't-ryb-2', title: 'Penandatanganan Mou Kepastian Pasokan Bahan', category: 'riset', completed: false, deadline: '2026-11-30', pic: 'pihak_3' },
      { id: 't-ryb-3', title: 'Penyesuaian Formulasi Masal bersama PT Agro', category: 'riset', completed: false, deadline: '2026-12-20', pic: 'joint' }
    ]
  },
  {
    id: 'prod-biolac-flow',
    name: 'Biolac Flow',
    code: 'RN-BLF-12',
    wave: 'wave1',
    stage: 'kemasan',
    pic: 'joint',
    rawMaterialStatus: 'Ready 100%',
    researchFocus: 'Bahan Baku Ready -> Riset & Pengujian Kemasan',
    startDate: '2026-09-10',
    estCompletionDate: '2027-05-10',
    riskLevel: 'low',
    bottleneck: 'Uji kebocoran & kedap udara kemasan pilihan',
    notes: 'Bahan baku siap, tinggal uji fisik kemasan sebelum BPOM final.',
    bottleneckLog: {
      rootCause: 'Desain awal kemasan foil membutuhkan penyegelan suhu lebih tinggi',
      actionPlan: 'Uji tekan & kebocoran sealer kemasan foil sachet bersama PT Agro',
      status: 'in_progress',
      targetResolveDate: '2026-10-16'
    },
    tasks: [
      { id: 't-blf-1', title: 'Formulasi & Uji Stabilitas Produk', category: 'riset', completed: true, deadline: '2026-09-01', pic: 'pt_agro' },
      { id: 't-blf-2', title: 'Sertifikat Hasil Uji Lab Lulus', category: 'uji_lab', completed: true, deadline: '2026-09-20', pic: 'pt_agro' },
      { id: 't-blf-3', title: 'Uji Kebocoran & Penetrasi Kelembapan Kemasan Foil', category: 'kemasan', completed: false, deadline: '2026-10-18', pic: 'joint' },
      { id: 't-blf-4', title: 'Submit Pendaftaran e-BPOM Registrasi TR', category: 'bpom_halal', completed: false, deadline: '2026-11-05', pic: 'pt_agro' }
    ]
  }
];
