/**
 * ==============================================================================
 * VISHNUHARAN'S SPOTIFY - MUSIC DATABASE
 * ==============================================================================
 * 
 * 🎵 HOW TO REPLACE OR ADD YOUR OWN AUDIO LINKS:
 * 
 * Option 1: Direct link (URL)
 * Change the "url" property to any direct MP3/audio link on the web, for example:
 *    url: "https://example.com/my-song.mp3"
 * 
 * Option 2: Local audio file
 * 1. Place your audio files in an "audio" folder inside this project (e.g., ./audio/radhimaa.mp3)
 * 2. Set the "url" property to the relative path:
 *    url: "./audio/radhimaa.mp3"
 * 
 * Option 3: Web App UI File Picker
 * You can also click the "..." menu or "Change Audio" icon on any song card in the app
 * to select an audio file directly from your computer or paste a new URL without modifying code!
 * ==============================================================================
 */

const DEFAULT_SONGS = [
  {
    id: 1,
    title: "Radhimaa",
    artist: "Sai Abhyankkar, Nargis Teji, Asma Teji, Vivek feat. Sai Smriti",
    album: "Think Indie",
    cover: "https://c.saavncdn.com/877/Radhimaa-From-Think-Indie-Tamil-2026-20260827192132-500x500.jpg",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "3:45",
    genre: "Indie Pop",
    year: 2024,
    jiosaavnUrl: "https://www.jiosaavn.com/song/radhimaa-from-think-indie/IF0bWzYJDms",
    lyrics: "Radhimaa... un vizhigal pesum mownam...\nEn nenjinil thendralai veesum neram...\nUnodu vaazhum kaalam pothumae..."
  },
  {
    id: 2,
    title: "Nallaru Po",
    artist: "Sai Abhyankkar, Tippu, Mohit Chauhan",
    album: "Dude",
    cover: "https://c.saavncdn.com/108/Nallaru-Po-From-Dude-Tamil-2025-20250919180543-500x500.jpg",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "3:30",
    genre: "Energetic Tamil",
    year: 2024,
    jiosaavnUrl: "https://www.jiosaavn.com/song/nallaru-po-from-dude/OCUhe1kFT3A",
    lyrics: "Nallaru po nallaru po... un vazhiyil vettri vanthu serum...\nKavalai ellam thalli veykkum neram ithu..."
  },
  {
    id: 3,
    title: "Yedi",
    artist: "G.V. Prakash Kumar, Dhanush",
    album: "Nilavuku En Mel Ennadi Kobam",
    cover: "https://c.saavncdn.com/682/Yedi-From-Nilavuku-En-Mel-Ennadi-Kobam-Tamil-2024-20250328193259-500x500.jpg",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: "3:18",
    genre: "Acoustic Melody",
    year: 2024,
    jiosaavnUrl: "https://www.jiosaavn.com/song/yedi-from-nilavuku-en-mel-ennadi-kobam/HRgIQTsFflg",
    lyrics: "Yedi yedi en uyirai thottu chellum penne...\nNee en mela kobam kondaal thaangaathu kanne..."
  },
  {
    id: 4,
    title: "Vazhithunaiye",
    artist: "Santhosh Narayanan, Dhee",
    album: "Dragon",
    cover: "https://c.saavncdn.com/581/Dragon-Original-Motion-Picture-Soundtrack-Tamil-2025-20250905071906-500x500.jpg",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    duration: "4:02",
    genre: "Soulful",
    year: 2024,
    jiosaavnUrl: "https://www.jiosaavn.com/song/vazhithunaiye/FwkeegRgZAA",
    lyrics: "Vazhithunaiye vazhithunaiye...\nIru vizhigal unodu serntha pinne...\nKaaladi suvadugal kooda paadum paatte..."
  },
  {
    id: 5,
    title: "Aasa Kooda",
    artist: "Sai Abhyankkar, Sai Smriti",
    album: "Think Indie",
    cover: "https://c.saavncdn.com/772/Aasa-Kooda-From-Think-Indie-Tamil-2024-20251026074529-500x500.jpg",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    duration: "3:52",
    genre: "Feel Good Pop",
    year: 2024,
    jiosaavnUrl: "https://www.jiosaavn.com/song/aasa-kooda/Nz0,YxhYRQI",
    lyrics: "Aasa kooda peraasaiya maarum pothu...\nUn paarvai mattum thaanae thedum koodu..."
  },
  {
    id: 6,
    title: "Arabic Kuthu - Halamithi Habibo",
    artist: "Anirudh Ravichander, Jonita Gandhi",
    album: "Beast",
    cover: "https://c.saavncdn.com/510/Beast-Tamil-2022-20220504184736-500x500.jpg",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    duration: "4:38",
    genre: "Dance / Kuthu",
    year: 2022,
    jiosaavnUrl: "https://www.jiosaavn.com/song/arabic-kuthu-halamithi-habibo/MQ8OYwNIY1E",
    lyrics: "Halamithi habibo... Malama pitha pithathe...\nHolamathi habibo... Balama hitha pithathe..."
  },
  {
    id: 7,
    title: "Adi Penne (Duet)",
    artist: "Stephen Zechariah, Srinisha Jayaseelan",
    album: "Naam Series",
    cover: "https://c.saavncdn.com/873/Adi-Penne-Tamil-2021-20211229150342-500x500.jpg",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    duration: "4:15",
    genre: "Romantic Melody",
    year: 2021,
    jiosaavnUrl: "https://www.jiosaavn.com/song/adi-penne-duet-from-naam-series/BT4xYg58e1U",
    lyrics: "Adi penne oru murai paarthu pesadi kanne...\nUn nizhalil naan vazha varam tharava munne..."
  },
  {
    id: 8,
    title: "Hey Minnale",
    artist: "G.V. Prakash Kumar, Haricharan, Shweta Mohan",
    album: "Amaran",
    cover: "https://c.saavncdn.com/332/Hey-Minnale-From-Amaran-Tamil-Tamil-2024-20241004094036-500x500.jpg",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    duration: "3:58",
    genre: "Melody Romance",
    year: 2024,
    jiosaavnUrl: "https://www.jiosaavn.com/song/hey-minnale-from-amaran-tamil/CSUBcDdmb1s",
    lyrics: "Hey minnale vanthu po en vaanil...\nNee kaatum anbil naan tholainthen anbe..."
  },
  {
    id: 9,
    title: "Oorum Blood",
    artist: "Sai Abhyankkar",
    album: "Dude",
    cover: "https://c.saavncdn.com/880/Dude-Original-Motion-Picture-Soundtrack-Tamil-2025-20251026215849-500x500.jpg",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    duration: "3:24",
    genre: "Urban Folk Beat",
    year: 2024,
    jiosaavnUrl: "https://www.jiosaavn.com/song/oorum-blood/OAQ4Ah5Kckc",
    lyrics: "Oorum blood-um orey thaalam poda...\nNamma aatam ippo thaniya nikkuthuda!"
  },
  {
    id: 10,
    title: "Dheema",
    artist: "Anirudh Ravichander",
    album: "Love Insurance Kompany",
    cover: "https://c.saavncdn.com/522/Love-Notes-by-Anirudh-Ravichander-Tamil-2026-20260605161958-500x500.jpg",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    duration: "3:40",
    genre: "Electro Pop",
    year: 2024,
    jiosaavnUrl: "https://www.jiosaavn.com/song/dheema-from-love-insurance-kompany/HlwSYTx1UEI",
    lyrics: "Dheema dheema en kaadhal unnai theda...\nKaatril midhakkum puthu isaiyena aada..."
  },
  {
    id: 11,
    title: "Pavazha Malli",
    artist: "Sai Abhyankkar, Vivek, Shruti Haasan",
    album: "Think Indie",
    cover: "https://c.saavncdn.com/984/Pavazha-Malli-From-Think-Indie-Tamil-2026-20260303084345-500x500.jpg",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
    duration: "3:35",
    genre: "Carnatic Indie Fusion",
    year: 2024,
    jiosaavnUrl: "https://www.jiosaavn.com/song/pavazha-malli-from-think-indie/GB5aeUx9cGw",
    lyrics: "Pavazha malli sirikkaiyile mazhai pozhiyum...\nUn azhagil manam thalladi kalaiyum..."
  },
  {
    id: 12,
    title: "Hayyoda",
    artist: "Anirudh Ravichander, Priya Mali",
    album: "Jawan",
    cover: "https://c.saavncdn.com/844/Feel-Good-Songs-Of-Kollywood-Tamil-2025-20250311181034-500x500.jpg",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
    duration: "3:20",
    genre: "Vibrant Romance",
    year: 2023,
    jiosaavnUrl: "https://www.jiosaavn.com/song/hayyoda-from-jawan/Hy1bVgJmGlw",
    lyrics: "Hayyoda un paarvai en meethu pattaalae...\nNenjukkul minnal pongi vilaiyaduthae..."
  },
  {
    id: 13,
    title: "Kanave Kanave",
    artist: "Anirudh Ravichander",
    album: "David",
    cover: "https://c.saavncdn.com/600/Kaadhalin-Inimai-Feel-Good-Songs-Tamil-2025-20260406191336-500x500.jpg",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
    duration: "4:45",
    genre: "Heartbreak Rock",
    year: 2013,
    jiosaavnUrl: "https://www.jiosaavn.com/song/kanave-kanave-from-david/MhA6cxFHf1s",
    lyrics: "Kanave kanave kalaivathano...\nEn kadhal unakku theriyathano...\nIravin nilave marainthathano..."
  },
  {
    id: 14,
    title: "Pookkal Pookkum",
    artist: "G.V. Prakash Kumar, Roop Kumar Rathod, Harini",
    album: "Madharasapattinam",
    cover: "https://c.saavncdn.com/780/In-the-Words-of-Na-Muthukumar-Tamil-2026-20260821175353-500x500.jpg",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
    duration: "6:38",
    genre: "Classic Symphony",
    year: 2010,
    jiosaavnUrl: "https://www.jiosaavn.com/song/pookkal-pookkum-from-madharasapattinam/FyMJQEN6bwQ",
    lyrics: "Pookkal pookkum tharunam aaro aariraro...\nPookkal thoovum nilavum aaro aariraro...\nUlagin osai adangiya neram..."
  },
  {
    id: 15,
    title: "Vishwanath & Sons",
    artist: "Sean Roldan, Suriya, Mamitha Baiju",
    album: "Vishwanath & Sons",
    cover: "https://c.saavncdn.com/435/Vishwanath-Sons-Tamil-Tamil-2026-20260827195541-500x500.jpg",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
    duration: "3:48",
    genre: "Family Drama Melody",
    year: 2024,
    jiosaavnUrl: "https://www.jiosaavn.com/album/vishwanath-sons-tamil/idBWk8rXOLM_",
    lyrics: "Engal veetin kural ketkuthu anbin ninaivaai...\nVaanam engum veesuthu nam sontha uravaai..."
  },
  {
    id: 16,
    title: "Neelothi",
    artist: "Sooraj Santhosh, Chinmayi Sripada, Justin Prabhakaran",
    album: "Sirai",
    cover: "https://c.saavncdn.com/459/Neelothi-From-Sirai-Tamil-2025-20251221140250-500x500.jpg",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
    duration: "4:12",
    genre: "Soulful Ballad",
    year: 2024,
    jiosaavnUrl: "https://www.jiosaavn.com/song/neelothi-from-sirai/MQxTRDgdcEI",
    lyrics: "Neelothi paayum kanavu karayai sernthidumo...\nNee kanda anbu kaalam maranthidumo..."
  },
  {
    id: 17,
    title: "Nee Paartha Vizhigal",
    artist: "Anirudh Ravichander, Vijay Yesudas, Shweta Mohan",
    album: "3 (Three)",
    cover: "https://c.saavncdn.com/195/3-Tamil-2011-20210522203119-500x500.jpg",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "4:28",
    genre: "Evergreen Romance",
    year: 2011,
    jiosaavnUrl: "https://www.jiosaavn.com/song/nee-paartha-vizhigal-the-touch-of-love/H1sAUjV2bVs",
    lyrics: "Nee paartha vizhigal nee paartha nodigal...\nKedaithal vaazhvaen endru en nenjodu solladi...\nEn kaadhal theeraatha thavamallavaa..."
  },
  {
    id: 18,
    title: "Nee Kavithaigala",
    artist: "Dhibu Ninan Thomas, Pradeep Kumar",
    album: "Maragatha Naanayam",
    cover: "https://c.saavncdn.com/773/Maragatha-Naanayam-Original-Motion-Picture-Soundtrack-Tamil-2017-20250910163741-500x500.jpg",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "4:32",
    genre: "Breezy Melody",
    year: 2017,
    jiosaavnUrl: "https://www.jiosaavn.com/song/nee-kavithaigala/Ghk9fyNSZwA",
    lyrics: "Nee kavithaigala penne un paarvai mozhiya...\nEn thoorathu nilave nee en arugil vanthaaye..."
  },
  {
    id: 19,
    title: "Neeyum Naanum Anbe",
    artist: "Hiphop Tamizha, Raghu Dixit, Sathyaprakash D.",
    album: "Imaikkaa Nodigal",
    cover: "https://c.saavncdn.com/250/Neeyum-Naanum-Original-Motion-Picture-Soundtrack-Tamil-2018-20251024173032-500x500.jpg",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: "4:47",
    genre: "Contemporary Love",
    year: 2018,
    jiosaavnUrl: "https://www.jiosaavn.com/song/neeyum-naanum-anbe-from-imaikkaa-nodigal/JFgNaS5hAlw",
    lyrics: "Neeyum naanum anbe kangal baashai paesinaal...\nKaalam pookkum anbe kaadhal dhesam maarinaal..."
  },
  {
    id: 20,
    title: "Nee Nenacha",
    artist: "G.V. Prakash Kumar, Sid Sriram",
    album: "Mr. Local",
    cover: "https://c.saavncdn.com/779/Mr-Local-Original-Motion-Picture-Soundtrack-Tamil-2019-20251026075226-500x500.jpg",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    duration: "4:10",
    genre: "Love Melody",
    year: 2019,
    jiosaavnUrl: "https://www.jiosaavn.com/song/nee-nenacha/EgAtCEd,Z2o",
    lyrics: "Nee nenacha nadakkaatha ethuvum undo ulagil...\nUn siripil mayangatha manam undo uyiril..."
  },
  {
    id: 21,
    title: "Ennadi Maayavi Nee",
    artist: "Santhosh Narayanan, Sid Sriram",
    album: "Vada Chennai",
    cover: "https://c.saavncdn.com/173/VadaChennai-Tamil-2018-20260108133313-500x500.jpg",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    duration: "4:11",
    genre: "Raw Folk Melody",
    year: 2018,
    jiosaavnUrl: "https://www.jiosaavn.com/song/ennadi-maayavi-nee-from-vadachennai/Rg9cWw1cVFE",
    lyrics: "Ennadi maayavi nee... Ennai vittu pogaatha kanave...\nUn vizhigal theendaatha idamundo en nenjile..."
  }
];

// Curated Playlists for Vishnuharan's Spotify
const DEFAULT_PLAYLISTS = [
  {
    id: "pl-vishnu-favorites",
    name: "Vishnuharan's Top Favorites",
    desc: "The absolute best picks on heavy rotation right now.",
    cover: "https://c.saavncdn.com/877/Radhimaa-From-Think-Indie-Tamil-2026-20260827192132-500x500.jpg",
    songIds: [1, 2, 5, 8, 10, 11]
  },
  {
    id: "pl-anirudh-vibes",
    name: "Anirudh Mania",
    desc: "Electrifying beats & soul-stirring melodies by Rockstar Anirudh.",
    cover: "https://c.saavncdn.com/510/Beast-Tamil-2022-20220504184736-500x500.jpg",
    songIds: [6, 10, 12, 13, 17]
  },
  {
    id: "pl-romantic-melodies",
    name: "Pure Tamil Melodies",
    desc: "Soft strings, poetic lyrics, and unforgettable love tracks.",
    cover: "https://c.saavncdn.com/332/Hey-Minnale-From-Amaran-Tamil-Tamil-2024-20241004094036-500x500.jpg",
    songIds: [3, 7, 8, 14, 16, 18, 19, 21]
  },
  {
    id: "pl-indie-revolution",
    name: "Tamil Indie & Pop Wave",
    desc: "Fresh, breezy, new-age independent hits taking over charts.",
    cover: "https://c.saavncdn.com/772/Aasa-Kooda-From-Think-Indie-Tamil-2024-20251026074529-500x500.jpg",
    songIds: [1, 2, 4, 5, 9, 11]
  },
  {
    id: "pl-late-night",
    name: "Midnight Vibes",
    desc: "Calm, late-night acoustic thoughts and deep feelings.",
    cover: "https://c.saavncdn.com/600/Kaadhalin-Inimai-Feel-Good-Songs-Tamil-2025-20260406191336-500x500.jpg",
    songIds: [4, 7, 13, 17, 20, 21]
  }
];

// Helper to get songs with custom user overrides from localStorage
function getSongsList() {
  const customOverrides = JSON.parse(localStorage.getItem('vspotify_custom_audio') || '{}');
  return DEFAULT_SONGS.map(song => {
    if (customOverrides[song.id]) {
      return { ...song, url: customOverrides[song.id].url || song.url, isCustomAudio: true };
    }
    return song;
  });
}
