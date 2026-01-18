import { config } from 'dotenv';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// .env.local 파일 로드
config({ path: '.env.local' });

// Supabase 환경 변수
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Supabase 클라이언트 (main에서 초기화)
let supabase: SupabaseClient;

// ===================== 타파스 데이터 =====================
const mainTapas = [
  {
    name: '하우스 샐러드',
    category: 'main',
    price: 12000,
    description: '새콤한 과일 소스와 신선한 올리브 오일의 금나리 스타일 샐러드',
    image_url: null,
    is_active: true,
    display_order: 1,
  },
  {
    name: '문어 스테이크',
    category: 'main',
    price: 28000,
    description: '콩피로 조리한 부드러운 문어 다리와 버터 입힌 감자 그리고 로메스코 소스',
    image_url: null,
    is_active: true,
    display_order: 2,
  },
  {
    name: '비프 스테이크',
    category: 'main',
    price: 24000,
    description: '부드러운 살치살과 함께 곁들일 메쉬포테이토와 백김치 치미추리',
    image_url: null,
    is_active: true,
    display_order: 3,
  },
  {
    name: '꿀대구 스테이크',
    category: 'main',
    price: 18000,
    description: '부드러운 대구살과 야채 삐스토, 수제 아이올리 소스',
    image_url: null,
    is_active: true,
    display_order: 4,
  },
  {
    name: '비프타르타르',
    category: 'main',
    price: 18000,
    description: '트러플 오일로 향을 더한 백김치페스토 베이스의 서양식 육회',
    image_url: null,
    is_active: true,
    display_order: 5,
  },
  {
    name: '흑돼지 너비아니 아라비아따 파스타',
    category: 'main',
    price: 17000,
    description: '제주 흑돼지로 만든 너비아니와 와사비 크림 페스토 조화의 매콤한 토마토 소스 파스타',
    image_url: null,
    is_active: true,
    display_order: 6,
  },
  {
    name: '피넛버터 라구 가지구이',
    category: 'main',
    price: 15000,
    description: '구운 가지 위 수제 라구 소스와 살라미, 고소한 피넛버터, 바질 페스토까지',
    image_url: null,
    is_active: true,
    display_order: 7,
  },
  {
    name: '매콤 크림소스 숏파스타',
    category: 'main',
    price: 14000,
    description: '매콤한 크림소스 베이스의 콘낄리에 파스타',
    image_url: null,
    is_active: true,
    display_order: 8,
  },
  {
    name: '루꼴라 라구 피자',
    category: 'main',
    price: 14000,
    description: '로띠 파라타 위 수제 라구 소스와 살라미, 루꼴라를 얹은, 가볍게 즐길 수 있는 피자',
    image_url: null,
    is_active: true,
    display_order: 9,
  },
];

const sideTapas = [
  {
    name: '플래터',
    category: 'side',
    price: 15000,
    description: '몇 가지 치즈와 초콜릿, 하몽, 백도 그리고 약간의 제철 과일',
    image_url: null,
    is_active: true,
    display_order: 1,
  },
  {
    name: '하몽 부르스케타',
    category: 'side',
    price: 13000,
    description: '짭조름한 하몽과 쌉쌀한 루꼴라, 달달한 수제 허니머스터드',
    image_url: null,
    is_active: true,
    display_order: 2,
  },
  {
    name: '크리스피 포테이토',
    category: 'side',
    price: 12000,
    description: '크리스피하게 구운 감자와 향긋한 수제 마요 소스',
    image_url: null,
    is_active: true,
    display_order: 3,
  },
  {
    name: '허니 크림치즈',
    category: 'side',
    price: 10000,
    description: '꿀에 버무린 크림치즈와 약간의 제철 과일, 크래커',
    image_url: null,
    is_active: true,
    display_order: 4,
  },
  {
    name: '양송이 구이',
    category: 'side',
    price: 9000,
    description: '살라미를 얹은 구운 양송이에 트러플 오일의 향까지 입힌 타파스',
    image_url: null,
    is_active: true,
    display_order: 5,
  },
  {
    name: '해장 똠양 컵라면',
    category: 'side',
    price: 5000,
    description: '육개장 컵라면 그런데 이제 똠양페이스트를 곁들인',
    image_url: null,
    is_active: true,
    display_order: 6,
  },
];

// ===================== 와인 데이터 =====================
interface WineData {
  name: string;
  eng_name: string;
  category: 'conventional' | 'natural';
  type: 'Red' | 'White' | 'Orange' | 'Sparkling' | 'Champagne';
  year: string;
  alcohol: string;
  origin: string;
  grape: string;
  price: number;
  description: string;
  opinion: string;
  image_url: string | null;
  vivino: string;
  is_active: boolean;
  display_order: number;
  ratings: { rating_type: string; rating: number }[];
}

// Conventional Red Wines
const conventionalRed: WineData[] = [
  {
    name: '수카르디 세리에 에이 말벡',
    eng_name: 'Zuccardi Serie A Malbec',
    category: 'conventional',
    type: 'Red',
    year: '2024',
    alcohol: '14.5%',
    origin: 'Argentina > Mendoza',
    grape: 'Malbec 100%',
    price: 63000,
    description: '짙은 퍼플 컬러에 검은 과실향의 풍미가 뛰어나고 초콜릿과 약간의 향신료까지 더해진 복합적인 풍미의 아르헨티나 말벡',
    opinion: '',
    image_url: null,
    vivino: '',
    is_active: true,
    display_order: 1,
    ratings: [
      { rating_type: '바디', rating: 4 },
      { rating_type: '산미', rating: 2 },
      { rating_type: '당도', rating: 1 },
    ],
  },
  {
    name: '클레런스 힐 맥라렌 베일 쉬라즈',
    eng_name: 'Clarence Hill Mclaren Vale Shiraz',
    category: 'conventional',
    type: 'Red',
    year: '2020',
    alcohol: '14%',
    origin: 'Australia > Mclaren Vale',
    grape: 'Shiraz 100%',
    price: 63000,
    description: '체리, 자두의 짙은 과실의 풍미와 바닐라, 오크가 더해져 탄탄한 구조감을 표현. 크리스피한 산도가 더해져 산뜻하게 마실 수 있는 와인',
    opinion: '',
    image_url: null,
    vivino: '',
    is_active: true,
    display_order: 2,
    ratings: [
      { rating_type: '바디', rating: 3 },
      { rating_type: '산미', rating: 3 },
      { rating_type: '당도', rating: 1 },
    ],
  },
  {
    name: '꼬뜨 뒤 론 빌라쥐 플랑 드 디유',
    eng_name: 'Cotes Du Rhone Villages Plan De Dieu',
    category: 'conventional',
    type: 'Red',
    year: '2020',
    alcohol: '14.5%',
    origin: 'France > Rhone',
    grape: 'Grenache 80%, Mourvedire 20%',
    price: 68000,
    description: '검은 자두, 블랙베리의 과실향과 흙, 우드향, 스모키 그리고 약간의 산미가 묻어나는 론 지방의 데일리 와인.',
    opinion: '',
    image_url: null,
    vivino: 'Jeb Dunnuck 90',
    is_active: true,
    display_order: 3,
    ratings: [
      { rating_type: '바디', rating: 3 },
      { rating_type: '산미', rating: 2 },
      { rating_type: '당도', rating: 1 },
    ],
  },
  {
    name: '이솔레 에 올레나, 끼안티 클라시코',
    eng_name: 'Isole e Olena, Chianti Classico',
    category: 'conventional',
    type: 'Red',
    year: '2020',
    alcohol: '13.5%',
    origin: 'Italy > Toscana',
    grape: 'Sangiovese 80%, Canaiolo 15%, Syrah 5%',
    price: 110000,
    description: '신선한 붉은 과실과 약간의 검은 자두, 스모키 향을 시작으로 신선한 허브와 바닐라까지. 까끌한 탄닌과 신선한 산미와 함께 균형잡힌 구조감과 밸런스까지',
    opinion: '',
    image_url: null,
    vivino: 'Vivino 4.0',
    is_active: true,
    display_order: 4,
    ratings: [
      { rating_type: '바디', rating: 4 },
      { rating_type: '산미', rating: 4 },
      { rating_type: '당도', rating: 1 },
    ],
  },
  {
    name: '바롤로 델 코뮤네 디 세라룽가 달바',
    eng_name: "Barolo del comnue di Serralunga d'Alba",
    category: 'conventional',
    type: 'Red',
    year: '2018',
    alcohol: '14%',
    origin: 'Italy > Piemonte',
    grape: 'Nebbiolo 100%',
    price: 170000,
    description: '세라룽가 달바 토양 특유의 힘과 섬세함, 우아함을 엿볼 수 있으며, 피니쉬가 길게 느껴짐. 노즈에 장미와 함께 체리, 스파이시가 느껴지고 꽉 찬 탄닌감은 견고함을 느낄 수 있으며, 완벽한 구조감까지 느낄 수 있음',
    opinion: '',
    image_url: null,
    vivino: 'Vivino 4.1',
    is_active: true,
    display_order: 5,
    ratings: [
      { rating_type: '바디', rating: 4 },
      { rating_type: '산미', rating: 2 },
      { rating_type: '당도', rating: 1 },
    ],
  },
  {
    name: '샤토 데 그라비에',
    eng_name: 'Chateau des Graviers',
    category: 'conventional',
    type: 'Red',
    year: '2018',
    alcohol: '12.5%',
    origin: 'France > Bordeaux',
    grape: 'Cabernet Suvignon 61%, Merlot 26%, Cabernet Franc 5%',
    price: 160000,
    description: '블랙베리, 블루베리의 노트와 실키한 탄닌감. 부르고뉴와 비교할 수 있는 정도의 섬세하고 부드러운 우아한 텍스처.',
    opinion: '',
    image_url: null,
    vivino: '',
    is_active: true,
    display_order: 6,
    ratings: [
      { rating_type: '바디', rating: 4 },
      { rating_type: '산미', rating: 2 },
      { rating_type: '당도', rating: 1 },
    ],
  },
  {
    name: '이사벨 & 피에르 클레멍 루즈 트라디시옹',
    eng_name: 'Isabelle & Pierre Clement Rouge Tradition',
    category: 'conventional',
    type: 'Red',
    year: '2020',
    alcohol: '14.5%',
    origin: 'France > Loire',
    grape: 'Pinot noir 100%',
    price: 85000,
    description: '잘 익은 체리, 라즈베리와 함께 느껴지는 꽃 향, 약간의 오크와 바닐라. 루아르 피노 누아의 장점인 산도와 타닌의 균형감이 뛰어나며, 페퍼와 탄닌감이 조화로움.',
    opinion: '',
    image_url: null,
    vivino: '',
    is_active: true,
    display_order: 7,
    ratings: [
      { rating_type: '바디', rating: 2 },
      { rating_type: '산미', rating: 2 },
      { rating_type: '당도', rating: 1 },
    ],
  },
  {
    name: '더블 파사주',
    eng_name: 'Double Passage',
    category: 'conventional',
    type: 'Red',
    year: '2021',
    alcohol: '14.5%',
    origin: 'France > Roussillon',
    grape: 'Grenache 60%, Mourvedre 20%, Cabernet Sauvignon 20%',
    price: 68000,
    description: '풀바디에 가까운 바디감과 탄닌감. 블랙베리, 다크 초콜릿, 커피의 뉘앙스와 함께 약간의 미네랄리티가 같이 느껴짐',
    opinion: '',
    image_url: null,
    vivino: '',
    is_active: true,
    display_order: 8,
    ratings: [
      { rating_type: '바디', rating: 4 },
      { rating_type: '산미', rating: 2 },
      { rating_type: '당도', rating: 1 },
    ],
  },
  {
    name: '일 비오젤바티코',
    eng_name: 'Il Bioselvatico',
    category: 'conventional',
    type: 'Red',
    year: '2019',
    alcohol: '13%',
    origin: 'Italy > Toscana',
    grape: 'Sangiovese 100%',
    price: 120000,
    description: '블랙체리와 같은 검은과실미와 함께 가죽, 흙 뉘앙스가 물씬 느껴지는 와인. 금나리 사장 최애 와인.',
    opinion: '',
    image_url: null,
    vivino: '',
    is_active: true,
    display_order: 9,
    ratings: [
      { rating_type: '바디', rating: 4 },
      { rating_type: '산미', rating: 4 },
      { rating_type: '당도', rating: 1 },
    ],
  },
  {
    name: '폰테비로',
    eng_name: 'Ponteviro',
    category: 'conventional',
    type: 'Red',
    year: '2021',
    alcohol: '14%',
    origin: 'Italy > Puglia',
    grape: 'Primitivo 100%',
    price: 85000,
    description: '블랙베리와, 자두, 체리의 과실미와 가죽, 스모키한 미네랄. 후추와 정향이 느껴지는 스파이시함까지. 긴 여운과 훌륭한 밸런스가 느껴지는 미디움-풀바디 와인.',
    opinion: '',
    image_url: null,
    vivino: '',
    is_active: true,
    display_order: 10,
    ratings: [
      { rating_type: '바디', rating: 4 },
      { rating_type: '산미', rating: 2 },
      { rating_type: '당도', rating: 1 },
    ],
  },
  {
    name: '엘리오 그라쏘 돌체토 달바',
    eng_name: "Elio Grasso Dolcetto d'Alba",
    category: 'conventional',
    type: 'Red',
    year: '2023',
    alcohol: '13.5%',
    origin: 'Italy > Piemont',
    grape: 'Dolcetto 100%',
    price: 86000,
    description: '스파이시, 가죽, 흙의 아로마. 풀바디에 가깝지만 적절한 산도가 균형감을 맞춰주며 유연한 탄닌감까지 느껴짐.',
    opinion: '',
    image_url: null,
    vivino: '',
    is_active: true,
    display_order: 11,
    ratings: [
      { rating_type: '바디', rating: 3 },
      { rating_type: '산미', rating: 3 },
      { rating_type: '당도', rating: 1 },
    ],
  },
  {
    name: '보아쏘 프란코 랑게 네비올로',
    eng_name: 'Boasso Franco, Langhe',
    category: 'conventional',
    type: 'Red',
    year: '2021',
    alcohol: '14.5%',
    origin: 'Italy > Piemont',
    grape: 'Nebbiolo 100%',
    price: 84000,
    description: '체리, 흩날리는 장미, 신선하고 약간의 산미와 바디감을 느낄 수 있고, 오크에서 오는 우드향이 매력적. 오픈 직후에는 약간의 알코올이 느껴지지만, 15분 정도만 있으면 과실향이 뿜뿜.',
    opinion: '',
    image_url: null,
    vivino: '',
    is_active: true,
    display_order: 12,
    ratings: [
      { rating_type: '바디', rating: 3 },
      { rating_type: '산미', rating: 3 },
      { rating_type: '당도', rating: 1 },
    ],
  },
  {
    name: '리루',
    eng_name: 'Paul Barre Leeloo',
    category: 'conventional',
    type: 'Red',
    year: '2019',
    alcohol: '',
    origin: 'France > Bordeaux',
    grape: 'Merlot 60%, Cabernet Franc 40%',
    price: 74000,
    description: '1990년대부터 보르도에서 비아디나믹으로 포도를 재배한 유기농 와이너리. 체리, 산딸기, 피망 향이 즉각적으로 느껴지고, 우리가 알고 있는 보르도 와인과는 다르게 활기차고 가벼운 타닌을 지녀 어렵지 않게 즐길 수 있는 와인!',
    opinion: '',
    image_url: null,
    vivino: '',
    is_active: true,
    display_order: 13,
    ratings: [
      { rating_type: '바디', rating: 3 },
      { rating_type: '산미', rating: 2 },
      { rating_type: '당도', rating: 1 },
    ],
  },
  {
    name: '도멘 아쉬 방 드 사부아 몽듀즈',
    eng_name: 'Domain H. Vin de Savoie Mondeuse',
    category: 'conventional',
    type: 'Red',
    year: '2023',
    alcohol: '',
    origin: 'France > Savoie',
    grape: 'Mondeuse 100%',
    price: 100000,
    description: '프랑스의 한국인 와인메이커, 하석환 농부님의 첫 빈티지 와인. 밀도감 좋은 탄닌에 은은한 허브, 블랙베리, 검붉은 체리. 산도감과 더불어 쉬라와 비슷한 뉘앙스지만, 스파이시가 더욱 두드러짐',
    opinion: '',
    image_url: null,
    vivino: '',
    is_active: true,
    display_order: 14,
    ratings: [
      { rating_type: '바디', rating: 3 },
      { rating_type: '산미', rating: 3 },
      { rating_type: '당도', rating: 1 },
    ],
  },
];

// Conventional White Wines
const conventionalWhite: WineData[] = [
  {
    name: '노벨럼 샤르도네',
    eng_name: 'Novellum Chardonnay',
    category: 'conventional',
    type: 'White',
    year: '2022',
    alcohol: '13%',
    origin: 'France > Roussillon',
    grape: 'Chardonnay 100%',
    price: 58000,
    description: '포도나무 평균 수령 30년 이상에서만 수확된 포도로 양조. 청사과, 멜론, 레몬 제스트. 둥근 질감과 함께 깨끗하게 느껴지는 풍미.',
    opinion: '',
    image_url: null,
    vivino: 'James Suckling 91 Points',
    is_active: true,
    display_order: 1,
    ratings: [
      { rating_type: '바디', rating: 3 },
      { rating_type: '산미', rating: 3 },
      { rating_type: '당도', rating: 1 },
    ],
  },
  {
    name: '도멘 펠릭스 에 피스 쌩-브리 소비뇽',
    eng_name: 'Domaine Felix Et Fils Saint-Birs Sauvignon',
    category: 'conventional',
    type: 'White',
    year: '2021',
    alcohol: '12.5%',
    origin: 'France > Bourgogne',
    grape: 'Sauvignon Blanc 100%',
    price: 68000,
    description: '부르고뉴 최상단에 위치한 작은 마을 Saint-Birs 지역의 가장 오래된 와이너리 중 하나.',
    opinion: '',
    image_url: null,
    vivino: 'Concours Mondial du Sauvignon - Silver',
    is_active: true,
    display_order: 2,
    ratings: [
      { rating_type: '바디', rating: 3 },
      { rating_type: '산미', rating: 3 },
      { rating_type: '당도', rating: 1 },
    ],
  },
  {
    name: '도멘 가쇼 모노, 부르고뉴 알리고떼',
    eng_name: 'Gachot-Monot, Bourgogne Aligote',
    category: 'conventional',
    type: 'White',
    year: '2021',
    alcohol: '12.5%',
    origin: 'France > Bourgogne',
    grape: 'Aligote 100%',
    price: 82000,
    description: '청사과와 열대 과실의 뉘앙스가 신선한 산도와 함께 입 안 가득 느껴지며, 약간의 잔디와 미네랄리티가 살짝 터치함.',
    opinion: '',
    image_url: null,
    vivino: '',
    is_active: true,
    display_order: 3,
    ratings: [
      { rating_type: '바디', rating: 3 },
      { rating_type: '산미', rating: 3 },
      { rating_type: '당도', rating: 1 },
    ],
  },
  {
    name: '뀌베 레센시얼',
    eng_name: "Cuvee L'Essencial",
    category: 'conventional',
    type: 'White',
    year: '2020',
    alcohol: '12.5%',
    origin: 'France > Jura',
    grape: 'Savagnin 100%',
    price: 95000,
    description: '사바냥 품종 고유의 시트러스한 과실감이 농후하고 묵직하게 느껴지고, 쥐라 지역 특유의 짭쪼름한 미네랄리티와 너티함이 흠뻑 느껴지는 미디움 바디의 화이트 와인.',
    opinion: '',
    image_url: null,
    vivino: '',
    is_active: true,
    display_order: 4,
    ratings: [
      { rating_type: '바디', rating: 4 },
      { rating_type: '산미', rating: 3 },
      { rating_type: '당도', rating: 1 },
    ],
  },
  {
    name: '마꽁 피에흐끌로, 떼루아 드 라 호쉬',
    eng_name: 'Macon-Pierreclos, Terroir de la Roche',
    category: 'conventional',
    type: 'White',
    year: '2022',
    alcohol: '13%',
    origin: 'France > Bourgogne',
    grape: 'Chardonnay 100%',
    price: 85000,
    description: '복합미 넘치는 핵과실 노트와 고급진 질감. 라 로쉬 포도밭 특유의 넘치는 미네랄까지',
    opinion: '',
    image_url: null,
    vivino: '',
    is_active: true,
    display_order: 5,
    ratings: [
      { rating_type: '바디', rating: 4 },
      { rating_type: '산미', rating: 2 },
      { rating_type: '당도', rating: 1 },
    ],
  },
  {
    name: '피에로판 소아베 클라시코',
    eng_name: 'Pieropan Soave Classico',
    category: 'conventional',
    type: 'White',
    year: '2021',
    alcohol: '12%',
    origin: 'Italy > Soave',
    grape: 'Garganega 100%',
    price: 72000,
    description: '살구, 모과에서 오는 시트러스함과 약간의 꿀과 미네랄리티. 소아베 클라시코의 정석.',
    opinion: '',
    image_url: null,
    vivino: '',
    is_active: true,
    display_order: 6,
    ratings: [
      { rating_type: '바디', rating: 2 },
      { rating_type: '산미', rating: 2 },
      { rating_type: '당도', rating: 1 },
    ],
  },
  {
    name: '인카스트로 비앙코',
    eng_name: 'Incastro Bianco',
    category: 'conventional',
    type: 'White',
    year: '2023',
    alcohol: '12%',
    origin: 'Italy > Aruzzo',
    grape: 'Pecorino 50%, Passerina 30%, Trebbiano 20%',
    price: 60000,
    description: '천도 복숭아 좋아하세요?',
    opinion: '',
    image_url: null,
    vivino: '',
    is_active: true,
    display_order: 7,
    ratings: [
      { rating_type: '바디', rating: 2 },
      { rating_type: '산미', rating: 4 },
      { rating_type: '당도', rating: 2 },
    ],
  },
  {
    name: '도멘 팡송, 샤블리',
    eng_name: 'Domaine Pinson, Chablis',
    category: 'conventional',
    type: 'White',
    year: '2022',
    alcohol: '12%',
    origin: 'France > Bourgogne',
    grape: 'Chardonnay 100%',
    price: 110000,
    description: '엔트리급의 샤블리지만 우아한 미네랄 캐릭터가 풍부하게 잘 표현됨.',
    opinion: '',
    image_url: null,
    vivino: '',
    is_active: true,
    display_order: 8,
    ratings: [
      { rating_type: '바디', rating: 3 },
      { rating_type: '산미', rating: 4 },
      { rating_type: '당도', rating: 1 },
    ],
  },
  {
    name: '상세르 코트 데 장부팡',
    eng_name: 'Cote des Embouffants Sancerre',
    category: 'conventional',
    type: 'White',
    year: '2022',
    alcohol: '12.5%',
    origin: 'France > Loire',
    grape: 'Sauvignon Blanc 100%',
    price: 97000,
    description: '시트러스함과 청사과 그리고 흰 꽃의 섬세한 아로마. 신선하고 크리스피한 미네릴라티가 돋보이며 복합미가 아주 좋은 상세르.',
    opinion: '',
    image_url: null,
    vivino: '',
    is_active: true,
    display_order: 9,
    ratings: [
      { rating_type: '바디', rating: 2 },
      { rating_type: '산미', rating: 3 },
      { rating_type: '당도', rating: 1 },
    ],
  },
  {
    name: '컬렉터블스 소비뇽 블랑',
    eng_name: 'Collectables Sauvignon Blanc',
    category: 'conventional',
    type: 'White',
    year: '2024',
    alcohol: '13.5%',
    origin: 'New Zealand > Marlborough',
    grape: 'Sauvignon Blanc 100%',
    price: 65000,
    description: '트로피컬을 시작으로 패션프루트, 레몬, 라임 뉘앙스가 느껴짐.',
    opinion: '',
    image_url: null,
    vivino: '',
    is_active: true,
    display_order: 10,
    ratings: [
      { rating_type: '바디', rating: 2 },
      { rating_type: '산미', rating: 5 },
      { rating_type: '당도', rating: 1 },
    ],
  },
  {
    name: '린솔리토',
    eng_name: "L'insolito",
    category: 'conventional',
    type: 'White',
    year: '2023',
    alcohol: '12%',
    origin: 'Italy > Puglia',
    grape: 'Minutolo 100%',
    price: 79000,
    description: '흰꽃, 흰색 과육과 함께 트로피컬 뉘앙스. 크리스피한 청사과와 기분 좋은 미네랄리티.',
    opinion: '',
    image_url: null,
    vivino: 'Vivino 4.0',
    is_active: true,
    display_order: 11,
    ratings: [
      { rating_type: '바디', rating: 3 },
      { rating_type: '산미', rating: 3 },
      { rating_type: '당도', rating: 1 },
    ],
  },
  {
    name: '레 셰브르푸이 블랑',
    eng_name: 'Les Cheverefeauilles Blanc',
    category: 'conventional',
    type: 'White',
    year: '2023',
    alcohol: '',
    origin: 'France > Rhone',
    grape: 'Clairette 50%, Roussanne 25%, Grenache Blanc 25%',
    price: 75000,
    description: '노즈에서는 시트러스와 함께 섬세한 흰색 과일이 느껴지고, 입 안에서는 상쾌함과 함께 균형잡힌 복숭아가 느껴짐.',
    opinion: '',
    image_url: null,
    vivino: '',
    is_active: true,
    display_order: 12,
    ratings: [
      { rating_type: '바디', rating: 2 },
      { rating_type: '산미', rating: 3 },
      { rating_type: '당도', rating: 1 },
    ],
  },
  {
    name: '넘버25',
    eng_name: 'Peter Lauer Number 25',
    category: 'conventional',
    type: 'White',
    year: '2023',
    alcohol: '',
    origin: 'Germany > Mosel',
    grape: 'Riesling 100%',
    price: 80000,
    description: '자몽, 레몬, 유자의 시트러스함에 더해 화사하게 피어나는 화이트 플라워.',
    opinion: '',
    image_url: null,
    vivino: '',
    is_active: true,
    display_order: 13,
    ratings: [
      { rating_type: '바디', rating: 2 },
      { rating_type: '산미', rating: 4 },
      { rating_type: '당도', rating: 1 },
    ],
  },
  {
    name: '도멘 아쉬 방 드 사부아 쉬냥-베르즈홍',
    eng_name: 'Domain H. Vin de Savoie Chignin-Bergeron',
    category: 'conventional',
    type: 'White',
    year: '2023',
    alcohol: '',
    origin: 'France > Savoie',
    grape: 'Bergeron(Roussanne) 100%',
    price: 90000,
    description: '프랑스의 한국인 와인메이커, 하석환 농부님의 첫 빈티지 와인.',
    opinion: '',
    image_url: null,
    vivino: '',
    is_active: true,
    display_order: 14,
    ratings: [
      { rating_type: '바디', rating: 3 },
      { rating_type: '산미', rating: 3 },
      { rating_type: '당도', rating: 1 },
    ],
  },
];

// Conventional Sparkling Wines
const conventionalSparkling: WineData[] = [
  {
    name: '빌레 다르판타, 프로세코 로제 브륏',
    eng_name: "Ville d'Arfanta Prosecco Rose Brut",
    category: 'conventional',
    type: 'Sparkling',
    year: '2022',
    alcohol: '11%',
    origin: 'Italy > Treviso',
    grape: 'Glera 85%, Pinot Nero 15%',
    price: 63000,
    description: '달지 않고 미세한 당도와 섬세한 기포의 로제 스파클링.',
    opinion: '',
    image_url: null,
    vivino: '',
    is_active: true,
    display_order: 1,
    ratings: [
      { rating_type: '바디', rating: 2 },
      { rating_type: '산미', rating: 3 },
      { rating_type: '당도', rating: 2 },
    ],
  },
  {
    name: '코스타로스 프로세코 수페리오네 엑스트라 드라이',
    eng_name: 'Costaross Prosecco Superiore Extra Dry',
    category: 'conventional',
    type: 'Sparkling',
    year: 'NV',
    alcohol: '13.5%',
    origin: 'Italy > Veneto',
    grape: 'Glera 100%',
    price: 68000,
    description: '청사과 시트러스한 뉘앙스. 달지 않는 100% 글레라 프로세코',
    opinion: '',
    image_url: null,
    vivino: '',
    is_active: true,
    display_order: 2,
    ratings: [
      { rating_type: '바디', rating: 3 },
      { rating_type: '산미', rating: 3 },
      { rating_type: '당도', rating: 3 },
    ],
  },
  {
    name: '레 떼리투아르 엑스트라 브뤼',
    eng_name: 'Les Territoires Extra Brut 4th Edition',
    category: 'conventional',
    type: 'Sparkling',
    year: 'NV',
    alcohol: '',
    origin: 'France > Bourgogne',
    grape: 'Pinot Noir, Chardonnay 등 7가지 품종',
    price: 85000,
    description: '상파뉴 인접 3km거리에 상파뉴와 동일한 토질을 가지고 있는 지역에서 장기 숙성으로 만들어 내는 와이너리.',
    opinion: '',
    image_url: null,
    vivino: '',
    is_active: true,
    display_order: 3,
    ratings: [
      { rating_type: '바디', rating: 3 },
      { rating_type: '산미', rating: 3 },
      { rating_type: '당도', rating: 1 },
    ],
  },
  {
    name: '초크랜즈 클래식 뀌베',
    eng_name: 'Chalklands Classic Cuvee',
    category: 'conventional',
    type: 'Sparkling',
    year: 'NV',
    alcohol: '12.5%',
    origin: 'UK > Kent',
    grape: 'PN 40% PM 30% CH 30%',
    price: 120000,
    description: '샴페인만큼 좋은 평가를 받고 있는 영국 스파클링.',
    opinion: '',
    image_url: null,
    vivino: 'Vivino 4.1',
    is_active: true,
    display_order: 4,
    ratings: [
      { rating_type: '바디', rating: 3 },
      { rating_type: '산미', rating: 4 },
      { rating_type: '당도', rating: 2 },
    ],
  },
  {
    name: '무따르 메쏘드 트라디쇼넬 블랑드 블랑 브뤼 나뚜르',
    eng_name: 'Moutard Methode Traditionnelle Blanc de Blanc Brut Nature',
    category: 'conventional',
    type: 'Sparkling',
    year: 'NV',
    alcohol: '12.5%',
    origin: 'France > Bourgogne',
    grape: 'Chardonnay 100%',
    price: 70000,
    description: '진한 레몬과 라임과 더불어 사과, 자몽, 복숭아까지.',
    opinion: '',
    image_url: null,
    vivino: '',
    is_active: true,
    display_order: 5,
    ratings: [
      { rating_type: '바디', rating: 2 },
      { rating_type: '산미', rating: 3 },
      { rating_type: '당도', rating: 1 },
    ],
  },
];

// Conventional Champagne
const conventionalChampagne: WineData[] = [
  {
    name: '생 샤망 뀌베 드 샤르도네 블랑 드 블랑',
    eng_name: 'Saint Charmant Cuvee de Chardonnay Brut',
    category: 'conventional',
    type: 'Champagne',
    year: '2012',
    alcohol: '12.5%',
    origin: 'France > Champagne',
    grape: 'Chardonnay 100%',
    price: 200000,
    description: '안정적으로 숙성된 2012 빈티지 샴페인.',
    opinion: '',
    image_url: null,
    vivino: '',
    is_active: true,
    display_order: 1,
    ratings: [
      { rating_type: '바디', rating: 3 },
      { rating_type: '산미', rating: 3 },
      { rating_type: '당도', rating: 1 },
    ],
  },
  {
    name: '무따르 그랑드 퀴베 브뤼',
    eng_name: 'Moutard Grande Cuvee Brut',
    category: 'conventional',
    type: 'Champagne',
    year: 'NV',
    alcohol: '12.5%',
    origin: 'France > Champagne',
    grape: 'Pinor Noir, Chardonnay',
    price: 120000,
    description: '브리오슈, 청사과의 뉘앙스. 풍성하지만 부드러운 기포와 풍만한 바디감까지.',
    opinion: '',
    image_url: null,
    vivino: '',
    is_active: true,
    display_order: 2,
    ratings: [
      { rating_type: '바디', rating: 3 },
      { rating_type: '산미', rating: 4 },
      { rating_type: '당도', rating: 1 },
    ],
  },
];

// Natural Red Wines
const naturalRed: WineData[] = [
  {
    name: '레 쥬스티스, 라밤보쉬',
    eng_name: 'Les Justices, La Bamboche',
    category: 'natural',
    type: 'Red',
    year: '2021',
    alcohol: '13.5%',
    origin: 'France > Loire',
    grape: 'Cabernet Franc 80%, Grolleau 20%',
    price: 95000,
    description: '붉은 과실류의 상큼함, 은은한 향신료가 더해지고, 부드러운 탄닌감이 느껴지는 루아르 지방의 전통적인 레드와인이 느껴짐.',
    opinion: '',
    image_url: null,
    vivino: '',
    is_active: true,
    display_order: 1,
    ratings: [
      { rating_type: '바디', rating: 2 },
      { rating_type: '산미', rating: 3 },
      { rating_type: '당도', rating: 1 },
    ],
  },
  {
    name: '레 쥬스티스, 쁘티폴',
    eng_name: 'Les Justices, Petite Folle',
    category: 'natural',
    type: 'Red',
    year: '2021',
    alcohol: '13.5%',
    origin: 'France > Loire',
    grape: 'Cabernet Franc 70%, Cabernet Sauvignon 30%',
    price: 110000,
    description: '네추럴 와인임에도 풀바디감을 느낄 수 있으며, 바디감에 비해 부드러운 탄닌감, 청량한 여운을 느낄 수 있음.',
    opinion: '',
    image_url: null,
    vivino: '',
    is_active: true,
    display_order: 2,
    ratings: [
      { rating_type: '바디', rating: 2 },
      { rating_type: '산미', rating: 3 },
      { rating_type: '당도', rating: 1 },
    ],
  },
  {
    name: '레빈 제트, 랑테흔 후즈',
    eng_name: 'Les Vigne Z, Lanterne rouge',
    category: 'natural',
    type: 'Red',
    year: '2022',
    alcohol: '14%',
    origin: 'France > Loire',
    grape: 'Grolleau Noir 100%',
    price: 95000,
    description: '크랜베리, 산딸기, 라즈베리의 과실미에 허브 뉘앙스가 곁들어진 레드 와인.',
    opinion: '',
    image_url: null,
    vivino: '',
    is_active: true,
    display_order: 3,
    ratings: [
      { rating_type: '바디', rating: 2 },
      { rating_type: '산미', rating: 3 },
      { rating_type: '당도', rating: 1 },
    ],
  },
  {
    name: '디스토르지옹',
    eng_name: 'Distorsion',
    category: 'natural',
    type: 'Red',
    year: '2021',
    alcohol: '13%',
    origin: 'France > Bordeaux',
    grape: 'Bordeaux, Negrette, Grenache, Merlot, Cabernet Franc',
    price: 84000,
    description: '묵직한 질감의 보르도 스타일의 레드 와인.',
    opinion: '',
    image_url: null,
    vivino: '',
    is_active: true,
    display_order: 4,
    ratings: [
      { rating_type: '바디', rating: 2 },
      { rating_type: '산미', rating: 3 },
      { rating_type: '당도', rating: 1 },
    ],
  },
];

// Natural Orange Wine
const naturalOrange: WineData[] = [
  {
    name: '마세라시옹',
    eng_name: 'Maceration',
    category: 'natural',
    type: 'Orange',
    year: '2020',
    alcohol: '14%',
    origin: 'France > Loire',
    grape: 'Chenin Blanc 100%',
    price: 93000,
    description: '아카시아, 청사과의 향에 약간의 아몬드가 느껴지는 와인.',
    opinion: '',
    image_url: null,
    vivino: '',
    is_active: true,
    display_order: 1,
    ratings: [
      { rating_type: '바디', rating: 2 },
      { rating_type: '산미', rating: 4 },
      { rating_type: '당도', rating: 2 },
    ],
  },
];

// Natural White Wines
const naturalWhite: WineData[] = [
  {
    name: '엘리자베스 어센틱',
    eng_name: 'Elisabeth Authentique',
    category: 'natural',
    type: 'White',
    year: '2019',
    alcohol: '14%',
    origin: 'France > Loire',
    grape: 'Chenin Blanc 100%',
    price: 93000,
    description: '복숭아와 같은 핵과류와 오렌지 껍질의 향.',
    opinion: '',
    image_url: null,
    vivino: '',
    is_active: true,
    display_order: 1,
    ratings: [
      { rating_type: '바디', rating: 3 },
      { rating_type: '산미', rating: 3 },
      { rating_type: '당도', rating: 0 },
    ],
  },
  {
    name: '레 쥬스티스, 쥬스트',
    eng_name: 'Les Justices, Juste',
    category: 'natural',
    type: 'White',
    year: '2021',
    alcohol: '12.5%',
    origin: 'France > Loire',
    grape: 'Chenin Blanc 100%',
    price: 105000,
    description: '손에 와인이 있는지 꽃다발이 있는지 헷갈리는, 꽃향기가 느껴지는 플로럴한 슈냉 블랑.',
    opinion: '',
    image_url: null,
    vivino: '',
    is_active: true,
    display_order: 2,
    ratings: [
      { rating_type: '바디', rating: 3 },
      { rating_type: '산미', rating: 3 },
      { rating_type: '당도', rating: 0 },
    ],
  },
  {
    name: '아흐노 꼼비에, 구뜨 블랑슈',
    eng_name: 'Arnaud Combier, Goutte Blanche',
    category: 'natural',
    type: 'White',
    year: '2022',
    alcohol: '14%',
    origin: 'France > Beaujolais',
    grape: 'Chadonnay 100%',
    price: 93000,
    description: "불어를 직역하면, '하얀색의 맛'이란 뜻.",
    opinion: '',
    image_url: null,
    vivino: '',
    is_active: true,
    display_order: 3,
    ratings: [
      { rating_type: '바디', rating: 3 },
      { rating_type: '산미', rating: 3 },
      { rating_type: '당도', rating: 0 },
    ],
  },
];

// ===================== 마이그레이션 함수 =====================
async function migrateTapas() {
  console.log('타파스 마이그레이션 시작...');

  const allTapas = [...mainTapas, ...sideTapas];

  const { data, error } = await supabase
    .from('tapas')
    .insert(allTapas)
    .select();

  if (error) {
    console.error('타파스 마이그레이션 실패:', error);
    return;
  }

  console.log('타파스 ' + data.length + '개 마이그레이션 완료');
}

async function migrateWines() {
  console.log('와인 마이그레이션 시작...');

  const allWines: WineData[] = [
    ...conventionalRed,
    ...conventionalWhite,
    ...conventionalSparkling,
    ...conventionalChampagne,
    ...naturalRed,
    ...naturalOrange,
    ...naturalWhite,
  ];

  let totalWines = 0;
  let totalRatings = 0;

  for (const wine of allWines) {
    const { ratings, ...wineData } = wine;

    // 와인 삽입
    const { data: insertedWine, error: wineError } = await supabase
      .from('wines')
      .insert(wineData)
      .select()
      .single();

    if (wineError) {
      console.error('와인 삽입 실패 (' + wine.name + '):', wineError);
      continue;
    }

    totalWines++;

    // 평점 삽입
    if (ratings && ratings.length > 0) {
      const ratingsData = ratings.map((r) => ({
        wine_id: insertedWine.id,
        rating_type: r.rating_type,
        rating: r.rating,
        max_rating: 5,
      }));

      const { error: ratingsError } = await supabase
        .from('wine_ratings')
        .insert(ratingsData);

      if (ratingsError) {
        console.error('평점 삽입 실패 (' + wine.name + '):', ratingsError);
      } else {
        totalRatings += ratings.length;
      }
    }
  }

  console.log('와인 ' + totalWines + '개, 평점 ' + totalRatings + '개 마이그레이션 완료');
}

async function main() {
  console.log('데이터 마이그레이션 시작\n');

  if (!supabaseUrl || !supabaseKey) {
    console.error('환경 변수가 설정되지 않았습니다.');
    console.log('NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 설정해주세요.');
    process.exit(1);
  }

  // Supabase 클라이언트 초기화
  supabase = createClient(supabaseUrl, supabaseKey);

  try {
    await migrateTapas();
    console.log('');
    await migrateWines();
    console.log('\n모든 마이그레이션이 완료되었습니다!');
  } catch (err) {
    console.error('마이그레이션 중 오류 발생:', err);
    process.exit(1);
  }
}

main();
