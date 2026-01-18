-- Geumnalee Admin Seed Data
-- Run this SQL in Supabase SQL Editor AFTER running schema.sql

-- ===================== 타파스 데이터 =====================
INSERT INTO tapas (name, category, price, description, image_url, is_active, display_order) VALUES
('하우스 샐러드', 'main', 12000, '새콤한 과일 소스와 신선한 올리브 오일의 금나리 스타일 샐러드', null, true, 1),
('문어 스테이크', 'main', 28000, '콩피로 조리한 부드러운 문어 다리와 버터 입힌 감자 그리고 로메스코 소스', null, true, 2),
('비프 스테이크', 'main', 24000, '부드러운 살치살과 함께 곁들일 메쉬포테이토와 백김치 치미추리', null, true, 3),
('꿀대구 스테이크', 'main', 18000, '부드러운 대구살과 야채 삐스토, 수제 아이올리 소스', null, true, 4),
('비프타르타르', 'main', 18000, '트러플 오일로 향을 더한 백김치페스토 베이스의 서양식 육회', null, true, 5),
('흑돼지 너비아니 아라비아따 파스타', 'main', 17000, '제주 흑돼지로 만든 너비아니와 와사비 크림 페스토 조화의 매콤한 토마토 소스 파스타', null, true, 6),
('피넛버터 라구 가지구이', 'main', 15000, '구운 가지 위 수제 라구 소스와 살라미, 고소한 피넛버터, 바질 페스토까지', null, true, 7),
('매콤 크림소스 숏파스타', 'main', 14000, '매콤한 크림소스 베이스의 콘낄리에 파스타', null, true, 8),
('루꼴라 라구 피자', 'main', 14000, '로띠 파라타 위 수제 라구 소스와 살라미, 루꼴라를 얹은, 가볍게 즐길 수 있는 피자', null, true, 9),
('플래터', 'side', 15000, '몇 가지 치즈와 초콜릿, 하몽, 백도 그리고 약간의 제철 과일', null, true, 1),
('하몽 부르스케타', 'side', 13000, '짭조름한 하몽과 쌉쌀한 루꼴라, 달달한 수제 허니머스터드', null, true, 2),
('크리스피 포테이토', 'side', 12000, '크리스피하게 구운 감자와 향긋한 수제 마요 소스', null, true, 3),
('허니 크림치즈', 'side', 10000, '꿀에 버무린 크림치즈와 약간의 제철 과일, 크래커', null, true, 4),
('양송이 구이', 'side', 9000, '살라미를 얹은 구운 양송이에 트러플 오일의 향까지 입힌 타파스', null, true, 5),
('해장 똠양 컵라면', 'side', 5000, '육개장 컵라면 그런데 이제 똠양페이스트를 곁들인', null, true, 6);

-- ===================== 와인 데이터: Conventional Red =====================
INSERT INTO wines (name, eng_name, category, type, year, alcohol, origin, grape, price, description, vivino, is_active, display_order) VALUES
('수카르디 세리에 에이 말벡', 'Zuccardi Serie A Malbec', 'conventional', 'Red', '2024', '14.5%', 'Argentina > Mendoza', 'Malbec 100%', 63000, '짙은 퍼플 컬러에 검은 과실향의 풍미가 뛰어나고 초콜릿과 약간의 향신료까지 더해진 복합적인 풍미의 아르헨티나 말벡', '', true, 1),
('클레런스 힐 맥라렌 베일 쉬라즈', 'Clarence Hill Mclaren Vale Shiraz', 'conventional', 'Red', '2020', '14%', 'Australia > Mclaren Vale', 'Shiraz 100%', 63000, '체리, 자두의 짙은 과실의 풍미와 바닐라, 오크가 더해져 탄탄한 구조감을 표현', '', true, 2),
('꼬뜨 뒤 론 빌라쥐 플랑 드 디유', 'Cotes Du Rhone Villages Plan De Dieu', 'conventional', 'Red', '2020', '14.5%', 'France > Rhone', 'Grenache 80%, Mourvedire 20%', 68000, '검은 자두, 블랙베리의 과실향과 흙, 우드향, 스모키 그리고 약간의 산미가 묻어나는 론 지방의 데일리 와인', 'Jeb Dunnuck 90', true, 3),
('이솔레 에 올레나, 끼안티 클라시코', 'Isole e Olena, Chianti Classico', 'conventional', 'Red', '2020', '13.5%', 'Italy > Toscana', 'Sangiovese 80%, Canaiolo 15%, Syrah 5%', 110000, '신선한 붉은 과실과 약간의 검은 자두, 스모키 향을 시작으로 신선한 허브와 바닐라까지', 'Vivino 4.0', true, 4),
('바롤로 델 코뮤네 디 세라룽가 달바', 'Barolo del comnue di Serralunga d''Alba', 'conventional', 'Red', '2018', '14%', 'Italy > Piemonte', 'Nebbiolo 100%', 170000, '세라룽가 달바 토양 특유의 힘과 섬세함, 우아함을 엿볼 수 있음', 'Vivino 4.1', true, 5),
('샤토 데 그라비에', 'Chateau des Graviers', 'conventional', 'Red', '2018', '12.5%', 'France > Bordeaux', 'Cabernet Suvignon 61%, Merlot 26%, Cabernet Franc 5%', 160000, '블랙베리, 블루베리의 노트와 실키한 탄닌감', '', true, 6),
('이사벨 & 피에르 클레멍 루즈 트라디시옹', 'Isabelle & Pierre Clement Rouge Tradition', 'conventional', 'Red', '2020', '14.5%', 'France > Loire', 'Pinot noir 100%', 85000, '잘 익은 체리, 라즈베리와 함께 느껴지는 꽃 향, 약간의 오크와 바닐라', '', true, 7),
('더블 파사주', 'Double Passage', 'conventional', 'Red', '2021', '14.5%', 'France > Roussillon', 'Grenache 60%, Mourvedre 20%, Cabernet Sauvignon 20%', 68000, '풀바디에 가까운 바디감과 탄닌감. 블랙베리, 다크 초콜릿, 커피의 뉘앙스', '', true, 8),
('일 비오젤바티코', 'Il Bioselvatico', 'conventional', 'Red', '2019', '13%', 'Italy > Toscana', 'Sangiovese 100%', 120000, '블랙체리와 같은 검은과실미와 함께 가죽, 흙 뉘앙스가 물씬 느껴지는 와인. 금나리 사장 최애 와인.', '', true, 9),
('폰테비로', 'Ponteviro', 'conventional', 'Red', '2021', '14%', 'Italy > Puglia', 'Primitivo 100%', 85000, '블랙베리와, 자두, 체리의 과실미와 가죽, 스모키한 미네랄', '', true, 10),
('엘리오 그라쏘 돌체토 달바', 'Elio Grasso Dolcetto d''Alba', 'conventional', 'Red', '2023', '13.5%', 'Italy > Piemont', 'Dolcetto 100%', 86000, '스파이시, 가죽, 흙의 아로마. 풀바디에 가깝지만 적절한 산도가 균형감을 맞춰줌', '', true, 11),
('보아쏘 프란코 랑게 네비올로', 'Boasso Franco, Langhe', 'conventional', 'Red', '2021', '14.5%', 'Italy > Piemont', 'Nebbiolo 100%', 84000, '체리, 흩날리는 장미, 신선하고 약간의 산미와 바디감을 느낄 수 있음', '', true, 12),
('리루', 'Paul Barre Leeloo', 'conventional', 'Red', '2019', '', 'France > Bordeaux', 'Merlot 60%, Cabernet Franc 40%', 74000, '1990년대부터 보르도에서 비아디나믹으로 포도를 재배한 유기농 와이너리', '', true, 13),
('도멘 아쉬 방 드 사부아 몽듀즈', 'Domain H. Vin de Savoie Mondeuse', 'conventional', 'Red', '2023', '', 'France > Savoie', 'Mondeuse 100%', 100000, '프랑스의 한국인 와인메이커, 하석환 농부님의 첫 빈티지 와인', '', true, 14);

-- ===================== 와인 데이터: Conventional White =====================
INSERT INTO wines (name, eng_name, category, type, year, alcohol, origin, grape, price, description, vivino, is_active, display_order) VALUES
('노벨럼 샤르도네', 'Novellum Chardonnay', 'conventional', 'White', '2022', '13%', 'France > Roussillon', 'Chardonnay 100%', 58000, '포도나무 평균 수령 30년 이상에서만 수확된 포도로 양조. 청사과, 멜론, 레몬 제스트', 'James Suckling 91 Points', true, 1),
('도멘 펠릭스 에 피스 쌩-브리 소비뇽', 'Domaine Felix Et Fils Saint-Birs Sauvignon', 'conventional', 'White', '2021', '12.5%', 'France > Bourgogne', 'Sauvignon Blanc 100%', 68000, '부르고뉴 최상단에 위치한 작은 마을 Saint-Birs 지역의 가장 오래된 와이너리 중 하나', 'Concours Mondial du Sauvignon - Silver', true, 2),
('도멘 가쇼 모노, 부르고뉴 알리고떼', 'Gachot-Monot, Bourgogne Aligote', 'conventional', 'White', '2021', '12.5%', 'France > Bourgogne', 'Aligote 100%', 82000, '청사과와 열대 과실의 뉘앙스가 신선한 산도와 함께 입 안 가득 느껴짐', '', true, 3),
('뀌베 레센시얼', 'Cuvee L''Essencial', 'conventional', 'White', '2020', '12.5%', 'France > Jura', 'Savagnin 100%', 95000, '사바냥 품종 고유의 시트러스한 과실감이 농후하고 묵직하게 느껴짐', '', true, 4),
('마꽁 피에흐끌로, 떼루아 드 라 호쉬', 'Macon-Pierreclos, Terroir de la Roche', 'conventional', 'White', '2022', '13%', 'France > Bourgogne', 'Chardonnay 100%', 85000, '복합미 넘치는 핵과실 노트와 고급진 질감', '', true, 5),
('피에로판 소아베 클라시코', 'Pieropan Soave Classico', 'conventional', 'White', '2021', '12%', 'Italy > Soave', 'Garganega 100%', 72000, '살구, 모과에서 오는 시트러스함과 약간의 꿀과 미네랄리티', '', true, 6),
('인카스트로 비앙코', 'Incastro Bianco', 'conventional', 'White', '2023', '12%', 'Italy > Aruzzo', 'Pecorino 50%, Passerina 30%, Trebbiano 20%', 60000, '천도 복숭아 좋아하세요?', '', true, 7),
('도멘 팡송, 샤블리', 'Domaine Pinson, Chablis', 'conventional', 'White', '2022', '12%', 'France > Bourgogne', 'Chardonnay 100%', 110000, '엔트리급의 샤블리지만 우아한 미네랄 캐릭터가 풍부하게 잘 표현됨', '', true, 8),
('상세르 코트 데 장부팡', 'Cote des Embouffants Sancerre', 'conventional', 'White', '2022', '12.5%', 'France > Loire', 'Sauvignon Blanc 100%', 97000, '시트러스함과 청사과 그리고 흰 꽃의 섬세한 아로마', '', true, 9),
('컬렉터블스 소비뇽 블랑', 'Collectables Sauvignon Blanc', 'conventional', 'White', '2024', '13.5%', 'New Zealand > Marlborough', 'Sauvignon Blanc 100%', 65000, '트로피컬을 시작으로 패션프루트, 레몬, 라임 뉘앙스가 느껴짐', '', true, 10),
('린솔리토', 'L''insolito', 'conventional', 'White', '2023', '12%', 'Italy > Puglia', 'Minutolo 100%', 79000, '흰꽃, 흰색 과육과 함께 트로피컬 뉘앙스', 'Vivino 4.0', true, 11),
('레 셰브르푸이 블랑', 'Les Cheverefeauilles Blanc', 'conventional', 'White', '2023', '', 'France > Rhone', 'Clairette 50%, Roussanne 25%, Grenache Blanc 25%', 75000, '노즈에서는 시트러스와 함께 섬세한 흰색 과일이 느껴짐', '', true, 12),
('넘버25', 'Peter Lauer Number 25', 'conventional', 'White', '2023', '', 'Germany > Mosel', 'Riesling 100%', 80000, '자몽, 레몬, 유자의 시트러스함에 더해 화사하게 피어나는 화이트 플라워', '', true, 13),
('도멘 아쉬 방 드 사부아 쉬냥-베르즈홍', 'Domain H. Vin de Savoie Chignin-Bergeron', 'conventional', 'White', '2023', '', 'France > Savoie', 'Bergeron(Roussanne) 100%', 90000, '프랑스의 한국인 와인메이커, 하석환 농부님의 첫 빈티지 와인', '', true, 14);

-- ===================== 와인 데이터: Conventional Sparkling =====================
INSERT INTO wines (name, eng_name, category, type, year, alcohol, origin, grape, price, description, vivino, is_active, display_order) VALUES
('빌레 다르판타, 프로세코 로제 브륏', 'Ville d''Arfanta Prosecco Rose Brut', 'conventional', 'Sparkling', '2022', '11%', 'Italy > Treviso', 'Glera 85%, Pinot Nero 15%', 63000, '달지 않고 미세한 당도와 섬세한 기포의 로제 스파클링', '', true, 1),
('코스타로스 프로세코 수페리오네 엑스트라 드라이', 'Costaross Prosecco Superiore Extra Dry', 'conventional', 'Sparkling', 'NV', '13.5%', 'Italy > Veneto', 'Glera 100%', 68000, '청사과 시트러스한 뉘앙스. 달지 않는 100% 글레라 프로세코', '', true, 2),
('레 떼리투아르 엑스트라 브뤼', 'Les Territoires Extra Brut 4th Edition', 'conventional', 'Sparkling', 'NV', '', 'France > Bourgogne', 'Pinot Noir, Chardonnay 등 7가지 품종', 85000, '상파뉴 인접 3km거리에 상파뉴와 동일한 토질을 가지고 있는 지역에서 만드는 스파클링', '', true, 3),
('초크랜즈 클래식 뀌베', 'Chalklands Classic Cuvee', 'conventional', 'Sparkling', 'NV', '12.5%', 'UK > Kent', 'PN 40% PM 30% CH 30%', 120000, '샴페인만큼 좋은 평가를 받고 있는 영국 스파클링', 'Vivino 4.1', true, 4),
('무따르 메쏘드 트라디쇼넬 블랑드 블랑 브뤼 나뚜르', 'Moutard Methode Traditionnelle Blanc de Blanc Brut Nature', 'conventional', 'Sparkling', 'NV', '12.5%', 'France > Bourgogne', 'Chardonnay 100%', 70000, '진한 레몬과 라임과 더불어 사과, 자몽, 복숭아까지', '', true, 5);

-- ===================== 와인 데이터: Conventional Champagne =====================
INSERT INTO wines (name, eng_name, category, type, year, alcohol, origin, grape, price, description, vivino, is_active, display_order) VALUES
('생 샤망 뀌베 드 샤르도네 블랑 드 블랑', 'Saint Charmant Cuvee de Chardonnay Brut', 'conventional', 'Champagne', '2012', '12.5%', 'France > Champagne', 'Chardonnay 100%', 200000, '안정적으로 숙성된 2012 빈티지 샴페인', '', true, 1),
('무따르 그랑드 퀴베 브뤼', 'Moutard Grande Cuvee Brut', 'conventional', 'Champagne', 'NV', '12.5%', 'France > Champagne', 'Pinor Noir, Chardonnay', 120000, '브리오슈, 청사과의 뉘앙스. 풍성하지만 부드러운 기포와 풍만한 바디감까지', '', true, 2);

-- ===================== 와인 데이터: Natural Red =====================
INSERT INTO wines (name, eng_name, category, type, year, alcohol, origin, grape, price, description, vivino, is_active, display_order) VALUES
('레 쥬스티스, 라밤보쉬', 'Les Justices, La Bamboche', 'natural', 'Red', '2021', '13.5%', 'France > Loire', 'Cabernet Franc 80%, Grolleau 20%', 95000, '붉은 과실류의 상큼함, 은은한 향신료가 더해지고, 부드러운 탄닌감이 느껴지는 루아르 지방의 전통적인 레드와인', '', true, 1),
('레 쥬스티스, 쁘티폴', 'Les Justices, Petite Folle', 'natural', 'Red', '2021', '13.5%', 'France > Loire', 'Cabernet Franc 70%, Cabernet Sauvignon 30%', 110000, '네추럴 와인임에도 풀바디감을 느낄 수 있으며, 바디감에 비해 부드러운 탄닌감', '', true, 2),
('레빈 제트, 랑테흔 후즈', 'Les Vigne Z, Lanterne rouge', 'natural', 'Red', '2022', '14%', 'France > Loire', 'Grolleau Noir 100%', 95000, '크랜베리, 산딸기, 라즈베리의 과실미에 허브 뉘앙스가 곁들어진 레드 와인', '', true, 3),
('디스토르지옹', 'Distorsion', 'natural', 'Red', '2021', '13%', 'France > Bordeaux', 'Bordeaux, Negrette, Grenache, Merlot, Cabernet Franc', 84000, '묵직한 질감의 보르도 스타일의 레드 와인', '', true, 4);

-- ===================== 와인 데이터: Natural Orange =====================
INSERT INTO wines (name, eng_name, category, type, year, alcohol, origin, grape, price, description, vivino, is_active, display_order) VALUES
('마세라시옹', 'Maceration', 'natural', 'Orange', '2020', '14%', 'France > Loire', 'Chenin Blanc 100%', 93000, '아카시아, 청사과의 향에 약간의 아몬드가 느껴지는 와인', '', true, 1);

-- ===================== 와인 데이터: Natural White =====================
INSERT INTO wines (name, eng_name, category, type, year, alcohol, origin, grape, price, description, vivino, is_active, display_order) VALUES
('엘리자베스 어센틱', 'Elisabeth Authentique', 'natural', 'White', '2019', '14%', 'France > Loire', 'Chenin Blanc 100%', 93000, '복숭아와 같은 핵과류와 오렌지 껍질의 향. 무엇보다 강하게 느껴지는 미네랄리티', '', true, 1),
('레 쥬스티스, 쥬스트', 'Les Justices, Juste', 'natural', 'White', '2021', '12.5%', 'France > Loire', 'Chenin Blanc 100%', 105000, '손에 와인이 있는지 꽃다발이 있는지 헷갈리는, 꽃향기가 느껴지는 플로럴한 슈냉 블랑', '', true, 2),
('아흐노 꼼비에, 구뜨 블랑슈', 'Arnaud Combier, Goutte Blanche', 'natural', 'White', '2022', '14%', 'France > Beaujolais', 'Chadonnay 100%', 93000, '불어를 직역하면, 하얀색의 맛이란 뜻. 하얀 꽃향기와 함께 잘 익은 빨간 사과의 노트', '', true, 3);

-- ===================== 와인 평점 데이터 =====================
-- Conventional Red Ratings
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '바디', 4, 5 FROM wines WHERE eng_name = 'Zuccardi Serie A Malbec';
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '산미', 2, 5 FROM wines WHERE eng_name = 'Zuccardi Serie A Malbec';
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '당도', 1, 5 FROM wines WHERE eng_name = 'Zuccardi Serie A Malbec';

INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '바디', 3, 5 FROM wines WHERE eng_name = 'Clarence Hill Mclaren Vale Shiraz';
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '산미', 3, 5 FROM wines WHERE eng_name = 'Clarence Hill Mclaren Vale Shiraz';
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '당도', 1, 5 FROM wines WHERE eng_name = 'Clarence Hill Mclaren Vale Shiraz';

INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '바디', 3, 5 FROM wines WHERE eng_name = 'Cotes Du Rhone Villages Plan De Dieu';
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '산미', 2, 5 FROM wines WHERE eng_name = 'Cotes Du Rhone Villages Plan De Dieu';
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '당도', 1, 5 FROM wines WHERE eng_name = 'Cotes Du Rhone Villages Plan De Dieu';

INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '바디', 4, 5 FROM wines WHERE eng_name = 'Isole e Olena, Chianti Classico';
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '산미', 4, 5 FROM wines WHERE eng_name = 'Isole e Olena, Chianti Classico';
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '당도', 1, 5 FROM wines WHERE eng_name = 'Isole e Olena, Chianti Classico';

-- Natural Red Ratings
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '바디', 2, 5 FROM wines WHERE eng_name = 'Les Justices, La Bamboche';
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '산미', 3, 5 FROM wines WHERE eng_name = 'Les Justices, La Bamboche';
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '당도', 1, 5 FROM wines WHERE eng_name = 'Les Justices, La Bamboche';

INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '바디', 2, 5 FROM wines WHERE eng_name = 'Les Justices, Petite Folle';
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '산미', 3, 5 FROM wines WHERE eng_name = 'Les Justices, Petite Folle';
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '당도', 1, 5 FROM wines WHERE eng_name = 'Les Justices, Petite Folle';

INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '바디', 2, 5 FROM wines WHERE eng_name = 'Les Vigne Z, Lanterne rouge';
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '산미', 3, 5 FROM wines WHERE eng_name = 'Les Vigne Z, Lanterne rouge';
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '당도', 1, 5 FROM wines WHERE eng_name = 'Les Vigne Z, Lanterne rouge';

INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '바디', 2, 5 FROM wines WHERE eng_name = 'Distorsion';
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '산미', 3, 5 FROM wines WHERE eng_name = 'Distorsion';
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '당도', 1, 5 FROM wines WHERE eng_name = 'Distorsion';

-- Natural Orange Ratings
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '바디', 2, 5 FROM wines WHERE eng_name = 'Maceration';
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '산미', 4, 5 FROM wines WHERE eng_name = 'Maceration';
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '당도', 2, 5 FROM wines WHERE eng_name = 'Maceration';

-- Natural White Ratings
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '바디', 3, 5 FROM wines WHERE eng_name = 'Elisabeth Authentique';
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '산미', 3, 5 FROM wines WHERE eng_name = 'Elisabeth Authentique';
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '당도', 0, 5 FROM wines WHERE eng_name = 'Elisabeth Authentique';

INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '바디', 3, 5 FROM wines WHERE eng_name = 'Les Justices, Juste';
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '산미', 3, 5 FROM wines WHERE eng_name = 'Les Justices, Juste';
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '당도', 0, 5 FROM wines WHERE eng_name = 'Les Justices, Juste';

INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '바디', 3, 5 FROM wines WHERE eng_name = 'Arnaud Combier, Goutte Blanche';
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '산미', 3, 5 FROM wines WHERE eng_name = 'Arnaud Combier, Goutte Blanche';
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '당도', 0, 5 FROM wines WHERE eng_name = 'Arnaud Combier, Goutte Blanche';

-- Conventional White Ratings (sample)
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '바디', 3, 5 FROM wines WHERE eng_name = 'Novellum Chardonnay';
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '산미', 3, 5 FROM wines WHERE eng_name = 'Novellum Chardonnay';
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '당도', 1, 5 FROM wines WHERE eng_name = 'Novellum Chardonnay';

-- Sparkling Ratings (sample)
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '바디', 2, 5 FROM wines WHERE eng_name = 'Ville d''Arfanta Prosecco Rose Brut';
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '산미', 3, 5 FROM wines WHERE eng_name = 'Ville d''Arfanta Prosecco Rose Brut';
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '당도', 2, 5 FROM wines WHERE eng_name = 'Ville d''Arfanta Prosecco Rose Brut';

-- Champagne Ratings
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '바디', 3, 5 FROM wines WHERE eng_name = 'Saint Charmant Cuvee de Chardonnay Brut';
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '산미', 3, 5 FROM wines WHERE eng_name = 'Saint Charmant Cuvee de Chardonnay Brut';
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '당도', 1, 5 FROM wines WHERE eng_name = 'Saint Charmant Cuvee de Chardonnay Brut';

INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '바디', 3, 5 FROM wines WHERE eng_name = 'Moutard Grande Cuvee Brut';
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '산미', 4, 5 FROM wines WHERE eng_name = 'Moutard Grande Cuvee Brut';
INSERT INTO wine_ratings (wine_id, rating_type, rating, max_rating)
SELECT id, '당도', 1, 5 FROM wines WHERE eng_name = 'Moutard Grande Cuvee Brut';
