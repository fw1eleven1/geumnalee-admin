import { config } from 'dotenv';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// .env.local 파일 로드
config({ path: '.env.local' });

// 환경 변수
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const CDN_URL = process.env.CDN_URL;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// geumnalee-menu 경로
const MENU_BASE_PATH = '/Users/js/workspace/geumnalee/geumnalee-menu/src';

// 타파스 이미지 매핑 (name -> local file path)
const tapasImageMap: Record<string, string> = {
  '하우스 샐러드': 'assets/salad.jpg',
  '문어 스테이크': 'assets/octopus.jpeg',
  '비프 스테이크': 'assets/steak.jpeg',
  '꿀대구 스테이크': 'assets/daegu.jpeg',
  '비프타르타르': 'assets/tartar.jpg',
  '피넛버터 라구 가지구이': 'assets/eggplant.jpg',
  '매콤 크림소스 숏파스타': 'assets/pasta.jpeg',
  '루꼴라 라구 피자': 'assets/pizza.jpg',
  '플래터': 'assets/plat.jpg',
  '하몽 부르스케타': 'assets/jamon.jpg',
  '크리스피 포테이토': 'assets/potato.jpg',
  '허니 크림치즈': 'assets/honey.jpg',
};

// 와인 이미지 매핑 (eng_name -> local file path)
const wineImageMap: Record<string, string> = {
  // Conventional Red
  'Zuccardi Serie A Malbec': 'assets/wine/conventional/zuccardi.png',
  'Clarence Hill Mclaren Vale Shiraz': 'assets/wine/conventional/mclaren.png',
  'Cotes Du Rhone Villages Plan De Dieu': 'assets/wine/conventional/cotes.png',
  'Isole e Olena, Chianti Classico': 'assets/wine/conventional/IsoleChianti.png',
  "Barolo del comnue di Serralunga d'Alba": 'assets/wine/conventional/Barolodelcomnue.png',
  'Chateau des Graviers': 'assets/wine/conventional/Graviers.png',
  'Isabelle & Pierre Clement Rouge Tradition': 'assets/wine/conventional/RougeTradition.png',
  'Double Passage': 'assets/wine/conventional/Passage.png',
  'Il Bioselvatico': 'assets/wine/conventional/Bioselvatico.png',
  'Ponteviro': 'assets/wine/conventional/Ponteviro.png',
  "Elio Grasso Dolcetto d'Alba": 'assets/wine/conventional/ElioGrasso.png',
  'Boasso Franco, Langhe': 'assets/wine/conventional/BoassoFranco.png',
  'Paul Barre Leeloo': 'assets/wine/conventional/Leeloo.png',
  'Domain H. Vin de Savoie Mondeuse': 'assets/wine/conventional/SavoieMondeuse.png',

  // Conventional White
  'Novellum Chardonnay': 'assets/wine/conventional/white_novellum.png',
  'Domaine Felix Et Fils Saint-Birs Sauvignon': 'assets/wine/conventional/white_domaineFelix.png',
  'Gachot-Monot, Bourgogne Aligote': 'assets/wine/conventional/white_aligote.png',
  "Cuvee L'Essencial": 'assets/wine/conventional/white_CuveeLEssencial.png',
  'Macon-Pierreclos, Terroir de la Roche': 'assets/wine/conventional/white_MaconPierreclos.png',
  'Pieropan Soave Classico': 'assets/wine/conventional/white_Pieropan.png',
  'Incastro Bianco': 'assets/wine/conventional/white_Incastro.png',
  'Domaine Pinson, Chablis': 'assets/wine/conventional/white_Chablis.png',
  'Cote des Embouffants Sancerre': 'assets/wine/conventional/white_Sancerre.png',
  'Collectables Sauvignon Blanc': 'assets/wine/conventional/white_Collectables.png',
  "L'insolito": 'assets/wine/conventional/white_Linsolito.png',
  'Les Cheverefeauilles Blanc': 'assets/wine/conventional/white_LesCheverefeauilles.png',
  'Peter Lauer Number 25': 'assets/wine/conventional/white_Number25.png',
  'Domain H. Vin de Savoie Chignin-Bergeron': 'assets/wine/conventional/white_SavoieChignin-Bergeron.png',

  // Conventional Sparkling
  "Ville d'Arfanta Prosecco Rose Brut": 'assets/wine/conventional/spa_Prosecco.png',
  'Costaross Prosecco Superiore Extra Dry': 'assets/wine/conventional/spa_Costaross.png',
  'Les Territoires Extra Brut 4th Edition': 'assets/wine/conventional/spa_LesTerritoires.png',
  'Chalklands Classic Cuvee': 'assets/wine/conventional/spa_Chalklands.png',
  'Moutard Methode Traditionnelle Blanc de Blanc Brut Nature': 'assets/wine/conventional/spa_MoutardMethodeTraditionnelle.png',

  // Conventional Champagne
  'Saint Charmant Cuvee de Chardonnay Brut': 'assets/wine/conventional/spa_SaintCharmantCuvee.png',
  'Moutard Grande Cuvee Brut': 'assets/wine/conventional/spa_MoutardGrandeCuvee.png',

  // Natural Red
  'Les Justices, La Bamboche': 'assets/wine/natural/la_bamboche.jpeg',
  'Les Justices, Petite Folle': 'assets/wine/natural/petite_folle.png',
  'Les Vigne Z, Lanterne rouge': 'assets/wine/natural/lanterne.png',
  'Distorsion': 'assets/wine/natural/distorsion.jpeg',

  // Natural Orange
  'Maceration': 'assets/wine/natural/orange_maceration.png',

  // Natural White
  'Elisabeth Authentique': 'assets/wine/natural/white_elisabeth_authentique.png',
  'Les Justices, Juste': 'assets/wine/natural/white_juste.png',
  'Arnaud Combier, Goutte Blanche': 'assets/wine/natural/white_GoutteBlanche.png',
};

// MIME 타입 결정
function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

// R2에 이미지 업로드
async function uploadToR2(
  r2Client: S3Client,
  localPath: string,
  r2Key: string
): Promise<string> {
  const fullPath = path.join(MENU_BASE_PATH, localPath);

  if (!fs.existsSync(fullPath)) {
    console.log(`  파일 없음: ${fullPath}`);
    return '';
  }

  const fileBuffer = fs.readFileSync(fullPath);
  const mimeType = getMimeType(fullPath);

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: r2Key,
    Body: fileBuffer,
    ContentType: mimeType,
  });

  await r2Client.send(command);
  return `${CDN_URL}/${r2Key}`;
}

// 타파스 이미지 업로드 및 DB 업데이트
async function uploadTapasImages(r2Client: S3Client, supabase: SupabaseClient) {
  console.log('\n타파스 이미지 업로드 시작...\n');

  let uploadCount = 0;

  for (const [name, localPath] of Object.entries(tapasImageMap)) {
    try {
      const fileName = path.basename(localPath);
      const r2Key = `tapas/${fileName}`;

      console.log(`업로드 중: ${name}`);
      const cdnUrl = await uploadToR2(r2Client, localPath, r2Key);

      if (cdnUrl) {
        const { error } = await supabase
          .from('tapas')
          .update({ image_url: cdnUrl })
          .eq('name', name);

        if (error) {
          console.log(`  DB 업데이트 실패: ${error.message}`);
        } else {
          console.log(`  완료: ${cdnUrl}`);
          uploadCount++;
        }
      }
    } catch (err) {
      console.log(`  오류: ${err}`);
    }
  }

  console.log(`\n타파스 이미지 ${uploadCount}개 업로드 완료`);
}

// 와인 이미지 업로드 및 DB 업데이트
async function uploadWineImages(r2Client: S3Client, supabase: SupabaseClient) {
  console.log('\n와인 이미지 업로드 시작...\n');

  let uploadCount = 0;

  for (const [engName, localPath] of Object.entries(wineImageMap)) {
    try {
      const fileName = path.basename(localPath);
      const r2Key = `wines/${fileName}`;

      console.log(`업로드 중: ${engName}`);
      const cdnUrl = await uploadToR2(r2Client, localPath, r2Key);

      if (cdnUrl) {
        const { error } = await supabase
          .from('wines')
          .update({ image_url: cdnUrl })
          .eq('eng_name', engName);

        if (error) {
          console.log(`  DB 업데이트 실패: ${error.message}`);
        } else {
          console.log(`  완료: ${cdnUrl}`);
          uploadCount++;
        }
      }
    } catch (err) {
      console.log(`  오류: ${err}`);
    }
  }

  console.log(`\n와인 이미지 ${uploadCount}개 업로드 완료`);
}

// 메인 함수
async function main() {
  console.log('='.repeat(50));
  console.log('이미지 업로드 시작');
  console.log('='.repeat(50));

  // 환경 변수 체크
  const requiredEnvVars = {
    CLOUDFLARE_ACCOUNT_ID,
    R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY,
    R2_BUCKET_NAME,
    CDN_URL,
    NEXT_PUBLIC_SUPABASE_URL: SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: SUPABASE_KEY,
  };

  for (const [name, value] of Object.entries(requiredEnvVars)) {
    if (!value) {
      console.error(`환경 변수 누락: ${name}`);
      process.exit(1);
    }
  }

  console.log(`\nR2 버킷: ${R2_BUCKET_NAME}`);
  console.log(`CDN URL: ${CDN_URL}`);
  console.log(`소스 경로: ${MENU_BASE_PATH}`);

  // 클라이언트 초기화
  const r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID!,
      secretAccessKey: R2_SECRET_ACCESS_KEY!,
    },
  });

  const supabase = createClient(SUPABASE_URL!, SUPABASE_KEY!);

  try {
    await uploadTapasImages(r2Client, supabase);
    await uploadWineImages(r2Client, supabase);

    console.log('\n' + '='.repeat(50));
    console.log('모든 이미지 업로드 완료!');
    console.log('='.repeat(50));
  } catch (err) {
    console.error('오류 발생:', err);
    process.exit(1);
  }
}

main();
