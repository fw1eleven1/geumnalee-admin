# geumnalee-menu Supabase 연동 가이드

geumnalee-menu 프로젝트를 수정하여 Supabase에서 메뉴 데이터를 가져오도록 합니다.

## 1. Supabase 클라이언트 설치

```bash
cd /Users/js/workspace/geumnalee/geumnalee-menu
npm install @supabase/supabase-js
```

## 2. 환경변수 설정

`.env` 파일 생성:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxx
```

## 3. Supabase 클라이언트 생성

`src/lib/supabase.js` 파일 생성:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 와인 데이터 가져오기
export async function getWines(category) {
  const { data, error } = await supabase
    .from('wines')
    .select('*, ratings:wine_ratings(*)')
    .eq('category', category)
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching wines:', error);
    return [];
  }

  // 기존 형식에 맞게 변환
  return data.map(wine => ({
    id: wine.id,
    name: wine.name,
    engName: wine.eng_name,
    type: wine.type,
    year: wine.year || '',
    alc: wine.alcohol || '',
    made: wine.origin || '',
    grape: wine.grape || '',
    price: wine.price,
    desc: wine.description || '',
    opinion: wine.opinion || '',
    img: wine.image_url || '',
    rating: wine.ratings?.map(r => ({
      type: r.rating_type,
      rating: r.rating,
    })) || [],
    maxRating: 5,
    vivino: wine.vivino || '',
  }));
}

// 타파스 데이터 가져오기
export async function getTapas() {
  const { data, error } = await supabase
    .from('tapas')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching tapas:', error);
    return { main: [], side: [] };
  }

  const main = data
    .filter(t => t.category === 'main')
    .map(transformTapas);

  const side = data
    .filter(t => t.category === 'side')
    .map(transformTapas);

  return { main, side };
}

function transformTapas(tapas) {
  return {
    id: tapas.id,
    name: tapas.name,
    price: tapas.price,
    desc: tapas.description || '',
    img: tapas.image_url || '',
  };
}
```

## 4. Conventional.jsx 수정

```jsx
import { useState, useEffect } from 'react';
import { getWines } from './lib/supabase';
import Wines from './Wines';

export default function Conventional() {
  const [wines, setWines] = useState({
    red: [],
    white: [],
    sparkling: [],
    champagne: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWines() {
      try {
        const data = await getWines('conventional');

        // 타입별로 분류 및 가격순 정렬
        setWines({
          red: data.filter(w => w.type === 'Red').sort((a, b) => b.price - a.price),
          white: data.filter(w => w.type === 'White').sort((a, b) => b.price - a.price),
          sparkling: data.filter(w => w.type === 'Sparkling').sort((a, b) => b.price - a.price),
          champagne: data.filter(w => w.type === 'Champagne').sort((a, b) => b.price - a.price),
        });
      } catch (error) {
        console.error('Failed to fetch wines:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchWines();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">로딩 중...</div>;
  }

  return (
    <div>
      <div className="h-10 flex items-center gap-4 px-4 mt-8" />

      {wines.champagne.length > 0 && (
        <div className="p-4">
          <div className="my-4 text-lg font-bold">CHAMPAGNE</div>
          <Wines wines={wines.champagne} />
        </div>
      )}

      {wines.sparkling.length > 0 && (
        <div className="p-4">
          <div className="my-4 text-lg font-bold">SPARKLING WINES</div>
          <Wines wines={wines.sparkling} />
        </div>
      )}

      {wines.red.length > 0 && (
        <div className="p-4">
          <div className="my-4 text-lg font-bold">RED WINES</div>
          <Wines wines={wines.red} />
        </div>
      )}

      {wines.white.length > 0 && (
        <div className="p-4">
          <div className="my-4 text-lg font-bold">WHITE WINES</div>
          <Wines wines={wines.white} />
        </div>
      )}
    </div>
  );
}
```

## 5. Natural.jsx 수정

```jsx
import { useState, useEffect } from 'react';
import { getWines } from './lib/supabase';

export default function Natural() {
  const [wines, setWines] = useState({
    red: [],
    orange: [],
    white: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWines() {
      try {
        const data = await getWines('natural');

        setWines({
          red: data.filter(w => w.type === 'Red').sort((a, b) => b.price - a.price),
          orange: data.filter(w => w.type === 'Orange').sort((a, b) => b.price - a.price),
          white: data.filter(w => w.type === 'White').sort((a, b) => b.price - a.price),
        });
      } catch (error) {
        console.error('Failed to fetch wines:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchWines();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">로딩 중...</div>;
  }

  // ... 기존 렌더링 코드 유지
}
```

## 6. Tapas.jsx 수정

```jsx
import { useState, useEffect } from 'react';
import { getTapas } from './lib/supabase';

export default function Tapas() {
  const [tapas, setTapas] = useState({ main: [], side: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTapas() {
      try {
        const data = await getTapas();
        setTapas(data);
      } catch (error) {
        console.error('Failed to fetch tapas:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTapas();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">로딩 중...</div>;
  }

  return (
    <div>
      {/* Main Tapas */}
      <div className="p-4">
        <div className="my-4 text-lg font-bold">MAIN TAPAS</div>
        {tapas.main.map(item => (
          <div key={item.id} className="mb-4">
            {/* 기존 렌더링 코드 */}
          </div>
        ))}
      </div>

      {/* Side Tapas */}
      <div className="p-4">
        <div className="my-4 text-lg font-bold">SIDE TAPAS</div>
        {tapas.side.map(item => (
          <div key={item.id} className="mb-4">
            {/* 기존 렌더링 코드 */}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 7. 기존 데이터 파일 백업

```bash
# 기존 파일 백업
mv src/list/conventional.js src/list/conventional.js.backup
mv src/list/natural.js src/list/natural.js.backup
```

## 이미지 마이그레이션

기존 이미지들은 로컬 파일로 import되어 있습니다.
Cloudflare R2로 마이그레이션하려면:

1. Admin 페이지에서 와인/타파스 수정 시 이미지를 다시 업로드
2. 또는 별도 스크립트로 기존 이미지들을 R2에 업로드 후 URL 업데이트
