/**
 * OneSaaS Plugin System Types
 * 플러그인 시스템 타입 정의
 */

// 테마 ID 타입
export type ThemeId =
  // 기본 테마 (10개)
  | "minimal"
  | "neon"
  | "luxury"
  | "playful"
  | "brutalist"
  | "corporate"
  | "startup"
  | "fintech"
  | "healthcare"
  | "ecommerce"
  // 특이한 테마 (10개)
  | "retrowave"
  | "cyberpunk"
  | "aurora"
  | "tokyo"
  | "forest"
  | "ocean"
  | "sunset"
  | "space"
  | "candy"
  | "terminal"
  // 전문 서비스 테마 (15개)
  | "lawyer"
  | "accounting"
  | "consulting"
  | "realestate"
  | "insurance"
  | "recruitment"
  | "marketing"
  | "agency"
  | "architect"
  | "photography"
  | "wedding"
  | "beauty"
  | "fitness"
  | "yoga"
  | "spa"
  // IT/테크 테마 (15개)
  | "saas"
  | "ai"
  | "blockchain"
  | "devtools"
  | "cloud"
  | "security"
  | "analytics"
  | "api"
  | "mobile"
  | "iot"
  | "vr"
  | "gaming"
  | "streaming"
  | "podcast"
  | "newsletter"
  // 크리에이티브/문화 테마 (15개)
  | "art"
  | "music"
  | "film"
  | "fashion"
  | "vintage"
  | "bohemian"
  | "scandinavian"
  | "japanese"
  | "korean"
  | "chinese"
  | "tropical"
  | "desert"
  | "arctic"
  | "noire"
  | "comic"
  // 산업/서비스 테마 (15개)
  | "restaurant"
  | "cafe"
  | "hotel"
  | "travel"
  | "education"
  | "kids"
  | "pet"
  | "automotive"
  | "agriculture"
  | "construction"
  | "logistics"
  | "energy"
  | "manufacturing"
  | "nonprofit"
  | "government"
  // 모던 & 트렌디 테마 (12개)
  | "glassmorphism"
  | "neomorphism"
  | "gradient"
  | "duotone"
  | "monochrome"
  | "pastel"
  | "earth"
  | "neonpunk"
  | "darkmode"
  | "lightmode"
  | "synthwave"
  | "vaporwave";

// 테마 모드
export type ThemeMode = "light" | "dark" | "system";

// 텍스트 방향
export type TextDirection = "ltr" | "rtl";

// 레이아웃 너비
export type LayoutWidth = "fluid" | "boxed";

// 사이드바 변형
export type SidebarVariant = "full" | "compact" | "icon-only" | "hidden";

// 위치 타입
export type PositionType = "fixed" | "scrollable";

// 테마 색상
export interface ThemeColors {
  bg: string;
  bgSecondary: string;
  text: string;
  textSecondary: string;
  accent: string;
  accentHover: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

// 테마 폰트
export interface ThemeFonts {
  display: string;
  body: string;
  mono: string;
}

// 테마 효과
export type ThemeEffect =
  | "glow"
  | "noise"
  | "grid"
  | "gradient"
  | "shadow"
  | "blur"
  | "grain";

// 테마 메타데이터
export interface ThemeMeta {
  id: ThemeId;
  name: string;
  nameEn: string;
  description: string;
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
  fonts: ThemeFonts;
  borderRadius: "none" | "small" | "medium" | "large" | "full";
  effects: ThemeEffect[];
}

// 템플릿 카테고리
export type TemplateCategory = "admin" | "blog" | "landing";

// 템플릿 메타데이터
export interface TemplateMeta {
  id: string;
  category: TemplateCategory;
  name: string;
  nameEn: string;
  description: string;
  thumbnail?: string;
  tags: string[];
}

// 컴포넌트 번들
export interface ComponentBundle {
  charts: boolean;
  forms: boolean;
  marketing: boolean;
  korean: boolean;
  dataDisplay: boolean;
  navigation: boolean;
}

// 한국 비즈니스 설정
export interface KoreanBusinessConfig {
  payment: "portone" | "tosspayments";
  addressApi: boolean;
  businessNumber: boolean;
  vatCalculation: boolean;
}

// 테마 설정
export interface ThemeConfig {
  active: ThemeId;
  mode: ThemeMode;
  direction: TextDirection;
}

// 레이아웃 설정
export interface LayoutConfig {
  width: LayoutWidth;
  sidebar: {
    variant: SidebarVariant;
    theme: "light" | "dark" | "themed";
    position: PositionType;
  };
  topbar: {
    theme: "light" | "dark" | "themed";
    position: PositionType;
  };
}

// 템플릿 설정
export interface TemplatesConfig {
  admin: string[];
  blog: string[];
  landing: string[];
}

// 전체 플러그인 설정
export interface PluginsConfig {
  theme: ThemeConfig;
  layout: LayoutConfig;
  templates: TemplatesConfig;
  components: ComponentBundle;
  korean: KoreanBusinessConfig;
}

// 플러그인 인터페이스
export interface Plugin {
  id: string;
  type: "theme" | "template" | "component";
  meta: ThemeMeta | TemplateMeta;
  load: () => Promise<void>;
  unload: () => void;
}

// 플러그인 레지스트리 인터페이스
export interface PluginRegistry {
  themes: Map<ThemeId, ThemeMeta>;
  templates: Map<string, TemplateMeta>;
  register: (plugin: Plugin) => void;
  unregister: (pluginId: string) => void;
  get: (pluginId: string) => Plugin | undefined;
  getAll: (type?: Plugin["type"]) => Plugin[];
}
