# 📋 **SWYFT – Product Requirements Document (PRD)**

### _Redefining the Moving Experience in Kenya & Africa_

**Version:** 1.0  
**Date:** December 2024

---

## 🎯 **1. Executive Summary**

### 1.1 Vision

To redefine the moving experience in Kenya & Africa by becoming the first integrated platform where users can discover a home, secure a viewing schedule, and book the logistics for their move in one unified flow.

### 1.2 Why This Wins

The logistics and moving industry in Kenya has remained fragmented and inefficient. Traditional methods require multiple phone calls, price negotiations, and uncertainty about driver availability. **Bolt** revolutionized ride-hailing by prioritizing **speed, simplicity, and reliability**—three principles Swyft applies to logistics.

**Swyft's competitive edge:**
- **Speed**: Instant booking with real-time driver matching (30-second timeout)
- **Simplicity**: Clean, intuitive interface with transparent pricing—no haggling
- **Reliability**: Real-time order tracking, driver verification, and consistent service quality

Unlike generic logistics platforms, Swyft offers:
- **Multi-vehicle flexibility**: From motorcycles (Swyft Boda) to 10-tonne lorries
- **Integrated housing discovery**: The only platform connecting home discovery with moving logistics
- **Transparent pricing**: Dynamic distance-based pricing with no hidden fees
- **Real-time tracking**: Live order status updates via Supabase real-time subscriptions

### 1.3 Target Market

**Primary Market**: Kenya (location-restricted via Google Places API)  
**Secondary Market**: Expansion to other African countries

**Target Users:**
- **Individuals** moving homes or transporting personal items
- **Small businesses** needing regular cargo delivery
- **E-commerce sellers** requiring parcel delivery services
- **Property seekers** looking for integrated moving solutions

---

## 👤 **2. Target Personas**

| Persona | Description | Pain Points | How Swyft Solves |
|---------|-------------|-------------|------------------|
| **"Moving Mwangi"** | 28-45, relocating for work/family, needs reliable movers | Multiple calls, price uncertainty, unreliable drivers | One-tap booking, transparent pricing, verified drivers |
| **"Business Benta"** | 30-50, runs small business, needs regular cargo delivery | Inconsistent pricing, driver availability issues | Scheduled rides, consistent pricing, real-time tracking |
| **"Parcel Pendo"** | 20-35, sells online, ships frequently | High delivery costs, slow service | Affordable parcel options (Boda), fast matching |
| **"House Hunter Haki"** | 25-40, searching for new home, needs moving coordination | Separate apps for housing and logistics, coordination hassle | Unified platform: discover home → schedule viewing → book move |

---

## 🔄 **3. User Journey & Core Flows**

### 3.1 **Onboarding Flow** (First-Time User)

**Goal**: Guide users through onboarding slides to housing discovery, then seamlessly to logistics booking.

| Step | What Happens | Data Captured | UI/UX Notes |
|------|--------------|---------------|-------------|
| **1. App Opens** | User lands on onboarding slides | — | Clean, Bolt-inspired minimal design |
| **1a. Login Option** | "Log In" text link at top right (for existing users) | — | Visible on all onboarding slides, allows skip to login |
| **2. Onboarding Slides** | Multiple slides showcasing Swyft value proposition | — | Swipeable carousel, progress indicator |
| **3. Last Slide: Authentication** | Final onboarding slide with "Continue with Google" button | — | Prominent Google OAuth button, email/password option available |
| **4. Post-Authentication Redirect** | First-time users → `/findhouse`, Returning users → `/dash` | `is_first_time` | Conditional routing based on user status |
| **5. PWA Install Prompt** | Custom install popup (iOS/Android specific) | — | Only shown on mobile, dismissible, appears after onboarding |

**Pro Tips:**
- Keep onboarding slides concise (3-5 slides max)
- Make "Continue with Google" the primary CTA on last slide
- Show login option prominently for returning users
- First-time users should be guided to housing discovery first (integrated vision)

---

### 3.2 **Booking Flow** (Core User Journey)

**Goal**: Complete booking in under 60 seconds from map view to confirmation.

| Step | What Happens | User Actions | System Actions |
|------|-------------|-------------|----------------|
| **1. Map View** | Google Maps with current location marker | User sees map | Auto-detect location via geolocation API |
| **2. Pickup Location** | SearchBar with Google Places Autocomplete | User confirms/edits pickup | Reverse geocode to coordinates |
| **3. Destination** | Second search input for destination | User enters destination | Geocode destination, calculate distance |
| **4. Route Display** | Google Maps DirectionsRenderer shows route | User sees route on map | Calculate distance & estimated time |
| **5. Vehicle Selection** | Tab-based categories (Cargo/Parcels/Moving) | User selects vehicle type | Display dynamic pricing based on distance |
| **6. Loader Option** | Toggle for loader service | User adds loaders (optional) | Add Ksh 600 per loader to total |
| **7. Cost Preview** | Real-time price calculation | User reviews total cost | Apply distance tiers and minimum fares |
| **8. Confirm Order** | Navigate to confirmation page | User taps "Confirm Order" | Save order to Redux, navigate to `/confirmOrder` |
| **9. Order Details** | Review booking details | User verifies pickup/destination | Display reverse-geocoded addresses |
| **10. Payment Selection** | Choose payment method | User selects sender/receiver | Store payment preference |
| **11. Package Type** | Select package category | User picks type (Furniture, etc.) | Required for order submission |
| **12. Submit Order** | Final confirmation | User taps "BOOK NOW" | POST to `/orders` endpoint, start driver matching |

**Error Handling:**
- Missing destination → Show error: "Please enter a destination"
- No vehicle selected → Highlight vehicle selection
- Network error → Retry with exponential backoff

---

### 3.3 **Driver Matching & Order Tracking Flow**

**Goal**: Match driver within 30 seconds, provide real-time updates throughout journey.

| Step | What Happens | User Experience | Technical Implementation |
|------|-------------|-----------------|-------------------------|
| **1. Finding Driver** | `FindDriver` component displays | Loading animation with "Finding a Driver..." | Poll Supabase for order status = 'Accepted' |
| **2. Driver Matched** | Order status updates to 'Accepted' | Navigate to `/driverDetails` | Supabase real-time subscription triggers |
| **3. Driver Details** | Display driver info, vehicle, contact | User sees driver photo, name, license plate | Fetch driver data from `/driver/:id` |
| **4. Driver En Route** | Status: 'arrived_at_customer' | Alert: "Your driver has arrived!" | Supabase UPDATE event triggers alert |
| **5. Pickup Complete** | Status: 'on_the_way_to_destination' | Alert: "Driver is on the way to destination!" | Real-time status update |
| **6. Delivery Complete** | Status: 'completed' | Navigate to `/rate-driver` | Clean up order state, show completion message |

**Timeout Handling:**
- 30-second timeout → Auto-cancel order, show "No drivers available" popup
- User options: Retry or Return Home

---

### 3.4 **Rating & Completion Flow**

**Goal**: Collect driver rating immediately after completion to improve service quality.

| Step | What Happens | User Actions | Data Captured |
|------|-------------|--------------|---------------|
| **1. Completion Screen** | Navigate to `/rate-driver` | User sees order summary | Latest order from ordersHistory |
| **2. Order Summary** | Display vehicle, distance, cost | User reviews trip details | — |
| **3. Rating Input** | 5-star rating component | User selects 1-5 stars | `rating` (1-5) |
| **4. Optional Comment** | Text area for feedback | User writes comment (optional) | `comment` |
| **5. Submit Rating** | POST to `/rating/driver/:id` | User taps "Submit Rating" | Store rating in backend |
| **6. Redirect** | Navigate to dashboard | User returns to home | Clear current order state |

---

### 3.5 **Housing Integration Flow** (Integrated Onboarding)

**Goal**: Seamless transition from onboarding to house discovery, then to viewing scheduling and moving logistics booking.

| Step | What Happens | User Actions | Data Captured | UI/UX Notes |
|------|-------------|--------------|---------------|-------------|
| **1. House Preferences** | Navigate to `/findhouse` after onboarding | User lands on preference selection page | — | Title: "Let us help you find your next home" |
| **1a. House Size Selection** | Six options: Bedsitter, 1-4 Bedroom, Other | User selects desired size | `house_size` | Green-bordered rectangular buttons |
| **1b. Property Type (Vibe)** | Horizontal carousel: Apartments, Stand Alones, Villas, Mansions | User scrolls and selects property type | `property_type` | Image cards with left/right navigation arrows |
| **1c. Budget Selection** | Two sliders for Min/Max budget in KES | User sets budget range | `min_budget`, `max_budget` | Green slider handles, KES currency display |
| **2. Location Selection** | "Finally," screen with location search | User enters preferred location (e.g., "Nairobi") | `preferred_location`, `location_coords` | Map display with green location marker, info: "we will recommend units within a 2km radius" |
| **3. Results Screen** | "Yay!" success screen showing matching units | User sees number of matching properties | `matching_units_count` | Shows locked/partially revealed property images, pagination indicator |
| **4. Unlock Units** | Payment prompt: "Unlock 5 units and get ready to move" | User pays KES 1,500 to unlock full property details | `payment_status` | Green button with "KES 1,500" CTA |
| **5. Bucket List Editing** | "Edit your Bucket list" screen with selected units | User manages selected properties (add/delete) | `selected_units[]` | 5 property cards with red delete and green add icons |
| **6. Viewing Confirmation** | "These are the Units You will view" message | User confirms selection | — | Informational text before proceeding |
| **7. Schedule Viewing** | "Choose a Date" button | User selects viewing date/time | `viewing_date`, `viewing_time` | Green CTA button |
| **8. Confirmation Modal** | "Confirmed" success modal | User sees confirmation | — | Green checkmark, "Happy Hunting !" message with emoji, "OK" button |
| **9. Move Planning** | Prompt: "Ready to move? Book your logistics" | User taps "Book Move" | — | Appears after viewing confirmation |
| **10. Quick Booking** | Streamlined booking flow | User selects vehicle, confirms | — | Pre-fill destination from selected property address |
| **11. Unified Dashboard** | View both housing and logistics | User sees all bookings | — | Single dashboard for housing + logistics |

**Current State**: Full housing integration flow is implemented. Users go through complete onboarding → housing discovery → viewing scheduling → logistics booking in one unified experience.

---

## 💰 **4. Monetization Model**

Swyft operates on a **commission-based model** with multiple revenue streams.

| Revenue Stream | Description | Current Status | Target Margin |
|----------------|-------------|----------------|---------------|
| **Driver Commission** | Percentage of each ride fare (15-20%) | ✅ Active | 15-20% |
| **Loader Service Fee** | Ksh 600 per loader (markup on actual cost) | ✅ Active | 20-30% markup |
| **Premium Features** | Priority booking, scheduled rides | 🔜 Phase 2 | Subscription-based |
| **Housing Integration** | Commission from property bookings | 🔜 Phase 2 | 5-10% per booking |
| **Affiliate Partnerships** | Partnerships with moving companies | 🔜 Phase 3 | Variable |

### Pricing Transparency

**Customer Pricing:**
- **Dynamic distance-based pricing** with transparent tier system
- **No hidden fees**—total cost shown before booking
- **Optional services** clearly priced (loaders at Ksh 600 each)

**Driver Earnings:**
- Drivers receive 80-85% of fare (15-20% platform commission)
- Loader fees split between platform and loader service provider

---

## 🗄️ **5. Data Model (Actual Database Schema)**

### Schema Overview

**Note**: This schema reflects the actual database implementation. Housing preferences and bucket lists are stored as JSONB fields within the `customers` table for flexibility and performance.

### Core Tables

```sql
-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

-- Alembic version tracking
CREATE TABLE public.alembic_version (
  version_num character varying NOT NULL,
  CONSTRAINT alembic_version_pkey PRIMARY KEY (version_num)
);

-- customers (users)
CREATE TABLE public.customers (
  id character varying NOT NULL,
  name character varying NOT NULL,
  email character varying NOT NULL UNIQUE,
  phone character varying NOT NULL UNIQUE,
  _password_hash character varying NOT NULL,
  first_name character varying,
  last_name character varying,
  profile_picture character varying,
  join_date timestamp without time zone,
  user_housing_preferences jsonb,  -- Stores housing preferences as JSONB
  user_bucket_list jsonb,           -- Stores selected properties for viewing as JSONB
  CONSTRAINT customers_pkey PRIMARY KEY (id)
);

-- drivers
CREATE TABLE public.drivers (
  id character varying NOT NULL,
  name character varying,
  phone character varying NOT NULL UNIQUE,
  email character varying NOT NULL UNIQUE,
  car_type character varying NOT NULL,
  online boolean,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  _password_hash character varying NOT NULL,
  id_number character varying NOT NULL,
  license_plate character varying NOT NULL,
  rating double precision,
  commission_status character varying,
  join_date timestamp without time zone,
  fcm_token character varying,
  verified boolean,
  driving_license text,
  national_id_front text,
  national_id_back text,
  vehicle_picture_front text,
  vehicle_picture_back text,
  inspection_report text,
  push_subscription json,
  car_insurance text,
  company_reg_certificate text,
  kra text,
  passport_photo text,
  certificate_conduct text,
  vehicle_make character varying,
  vehicle_model character varying,
  vehicle_year integer,
  vehicle_color character varying,
  first_name character varying,
  last_name character varying,
  profile_picture text,
  CONSTRAINT drivers_pkey PRIMARY KEY (id)
);

-- drivers_otps (One-Time Passwords for driver verification)
CREATE TABLE public.drivers_otps (
  id integer NOT NULL DEFAULT nextval('drivers_otps_id_seq'::regclass),
  code character varying NOT NULL,
  purpose character varying NOT NULL,
  created_at timestamp without time zone,
  expires_at timestamp without time zone NOT NULL,
  verified boolean,
  driver_email character varying NOT NULL,
  CONSTRAINT drivers_otps_pkey PRIMARY KEY (id)
);

-- orders
CREATE TABLE public.orders (
  id character varying NOT NULL,
  vehicle_type character varying NOT NULL,
  distance double precision NOT NULL,
  loaders integer NOT NULL,
  loader_cost double precision NOT NULL,
  total_cost double precision NOT NULL,
  user_lat double precision NOT NULL,
  user_lng double precision NOT NULL,
  dest_lat double precision NOT NULL,
  dest_lng double precision NOT NULL,
  time character varying NOT NULL,
  created_at timestamp without time zone,
  driver_id character varying,
  customer_id character varying,
  declined_drivers ARRAY,
  status character varying,
  commission double precision,
  net_earnings double precision,
  cancellation_reason character varying,
  is_paid boolean,
  package_type character varying,
  pay_by character varying,
  receiver_name character varying,
  receiver_phone character varying,
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id),
  CONSTRAINT orders_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.drivers(id)
);

-- payments
CREATE TABLE public.payments (
  id character varying NOT NULL,
  driver_id character varying NOT NULL,
  amount double precision NOT NULL,
  timestamp timestamp without time zone,
  CONSTRAINT payments_pkey PRIMARY KEY (id),
  CONSTRAINT payments_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.drivers(id)
);

-- ratings
CREATE TABLE public.ratings (
  id character varying NOT NULL,
  rating_score integer NOT NULL,
  order_id character varying,
  ride_id character varying,
  CONSTRAINT ratings_pkey PRIMARY KEY (id),
  CONSTRAINT ratings_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id),
  CONSTRAINT ratings_ride_id_fkey FOREIGN KEY (ride_id) REFERENCES public.rides(id)
);

-- rides (linked to orders)
CREATE TABLE public.rides (
  id character varying NOT NULL,
  distance double precision NOT NULL,
  created_time timestamp without time zone,
  loader_cost double precision NOT NULL,
  from_location character varying NOT NULL,
  to_location character varying NOT NULL,
  price double precision NOT NULL,
  order_id character varying,
  CONSTRAINT rides_pkey PRIMARY KEY (id),
  CONSTRAINT rides_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id)
);

-- scheduled_moves (scheduled rides)
CREATE TABLE public.scheduled_moves (
  id character varying NOT NULL,
  vehicle_type character varying NOT NULL,
  distance double precision NOT NULL,
  loaders integer NOT NULL,
  loader_cost double precision NOT NULL,
  total_cost double precision NOT NULL,
  user_lat double precision NOT NULL,
  user_lng double precision NOT NULL,
  dest_lat double precision NOT NULL,
  dest_lng double precision NOT NULL,
  time character varying NOT NULL,
  scheduled_time timestamp without time zone NOT NULL,
  created_at timestamp without time zone,
  driver_id character varying,
  customer_id character varying,
  CONSTRAINT scheduled_moves_pkey PRIMARY KEY (id),
  CONSTRAINT scheduled_moves_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id),
  CONSTRAINT scheduled_moves_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.drivers(id)
);

-- vehicles
CREATE TABLE public.vehicles (
  id character varying NOT NULL,
  body_type character varying NOT NULL,
  plate_no character varying NOT NULL UNIQUE,
  driver_id character varying,
  customer_id character varying,
  CONSTRAINT vehicles_pkey PRIMARY KEY (id),
  CONSTRAINT vehicles_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id),
  CONSTRAINT vehicles_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.drivers(id)
);
```

### Key Schema Notes

**Housing Data Storage:**
- **`user_housing_preferences`** (JSONB in `customers` table): Stores user's housing preferences including:
  - `house_size`: 'bedsitter', '1_bedroom', '2_bedroom', '3_bedroom', '4_bedroom', 'other'
  - `property_type`: 'apartments', 'stand_alone', 'villas', 'mansions'
  - `min_budget`: Minimum budget in KES
  - `max_budget`: Maximum budget in KES
  - `preferred_location`: Location name (e.g., "Nairobi")
  - `location_lat`: Latitude coordinate
  - `location_lng`: Longitude coordinate

- **`user_bucket_list`** (JSONB in `customers` table): Stores array of selected property unit IDs for viewing appointments.

**Data Types:**
- Uses `character varying` instead of `VARCHAR`
- Uses `double precision` for coordinates and monetary values
- Uses `timestamp without time zone` for timestamps
- Uses `jsonb` for flexible JSON storage (housing preferences, bucket list, push subscriptions)

**Relationships:**
- `orders.customer_id` → `customers.id`
- `orders.driver_id` → `drivers.id`
- `ratings.order_id` → `orders.id`
- `ratings.ride_id` → `rides.id`
- `rides.order_id` → `orders.id`
- `scheduled_moves.customer_id` → `customers.id`
- `scheduled_moves.driver_id` → `drivers.id`

### Real-time Subscriptions

```javascript
// Supabase real-time channel for order updates
supabase
  .channel('orders')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'orders'
  }, (payload) => {
    // Handle order status updates in real-time
  })
  .subscribe();
```

---

## ⚙️ **6. Technical Architecture**

### 6.1 Stack Overview

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend Framework** | React 18.3.1 | UI components and interactions |
| **Build Tool** | Vite 5.4.9 | Fast development and optimized builds |
| **State Management** | Redux Toolkit 2.5.1 | Global state (user, orders, driver) |
| **Routing** | React Router v6 | Client-side navigation |
| **Backend Database** | Supabase (PostgreSQL) | Data persistence |
| **Real-time** | Supabase Realtime | Live order status updates |
| **Maps & Geolocation** | Google Maps API | Maps, directions, geocoding |
| **UI Components** | Material UI 6.1.4 | Pre-built components |
| **Authentication** | JWT (Backend API) | Secure user sessions |
| **HTTP Client** | Axios 1.7.9 | API requests |
| **Hosting** | Vercel | Frontend deployment |
| **PWA** | Service Worker | Offline support, installability |

### 6.2 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SWYFT ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐ │
│  │   Client    │───▶│  Vercel     │───▶│  Backend API    │ │
│  │   (PWA)     │    │  (Hosting)  │    │  (Node/Express) │ │
│  └─────────────┘    └─────────────┘    └────────┬────────┘ │
│        │                                         │          │
│        │                                         ▼          │
│        │                               ┌─────────────────┐  │
│        │                               │    Supabase     │  │
│        │                               │  (PostgreSQL +  │  │
│        └──────Real-time Updates───────▶│   Real-time)    │  │
│                                        └─────────────────┘  │
│                                                             │
│  ┌─────────────┐                       ┌─────────────────┐  │
│  │ Google Maps │                       │    Firebase     │  │
│  │     API     │                       │   (Reserved)    │  │
│  └─────────────┘                       └─────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 6.3 Key Integrations

| Integration | Purpose | Implementation |
|-------------|---------|----------------|
| **Google Maps API** | Maps, directions, geocoding, Places Autocomplete | `@react-google-maps/api` |
| **Supabase Realtime** | Live order status updates | PostgreSQL change listeners |
| **Backend API** | Authentication, order management, driver data | REST API at `swyft-backend-client-nine.vercel.app` |
| **Service Worker** | PWA offline support, caching | Custom `sw.js` |

### 6.4 File Structure

```
src/
├── Components/              # React components
│   ├── Map.jsx             # Main map view with Google Maps
│   ├── Dash.jsx            # Vehicle selection & booking
│   ├── SearchBar.jsx       # Location search with autocomplete
│   ├── Login.jsx           # Authentication
│   ├── SignUp.jsx          # User registration
│   ├── OrderDetailsConfirmation.jsx  # Order review & payment
│   ├── FindDriver.jsx      # Driver matching UI
│   ├── driverDetails.jsx  # Driver info display
│   ├── MyRides.jsx        # Ride history
│   ├── Account.jsx        # User profile
│   ├── Settings.jsx       # User settings
│   ├── OrderCompletion.jsx # Rating flow
│   ├── TripTracker.jsx    # Real-time tracking (placeholder)
│   ├── FindHouse.jsx      # Housing integration landing
│   └── Navbar.jsx         # Navigation sidebar
├── Redux/                  # State management
│   ├── Store.js           # Redux store configuration
│   └── Reducers/
│       ├── UserSlice.js           # User state
│       ├── CurrentOrderSlice.js   # Active order
│       ├── DriverDetailsSlice.js  # Driver info
│       └── ordersHistorySlice.js  # Past orders
├── Styles/                 # Component CSS
├── contexts/               # React contexts
│   └── UserContext.jsx     # User context provider
├── Utils/                  # Utility functions
├── routes.jsx             # Route definitions
├── App.jsx                # Main app component
└── main.jsx               # Entry point
```

---

## 📊 **7. Success Metrics (MVP)**

| Metric | Target (30 days) | Target (90 days) | Measurement |
|--------|------------------|-------------------|-------------|
| **Daily Active Users (DAU)** | 200+ | 1,000+ | Analytics |
| **Booking Completion Rate** | >70% | >80% | Completed orders / Started bookings |
| **Driver Match Time** | <30 seconds | <20 seconds | Average time to 'Accepted' status |
| **User Retention (D7)** | 25% | 40% | Users active 7 days after first booking |
| **Average Order Value** | Ksh 2,500 | Ksh 3,000 | Total revenue / Total orders |
| **Rating Average** | 4.2+ | 4.5+ | Average driver rating |
| **PWA Install Rate** | 15% | 25% | Installs / Mobile visits |

---

## 🚀 **8. MVP Scope**

### ✅ Must Have (Current Implementation)

- [x] User authentication (login/signup)
- [x] Google Maps integration with location search
- [x] Multi-vehicle selection (Cargo/Parcels/Moving)
- [x] Dynamic pricing calculation
- [x] Order creation and submission
- [x] Real-time driver matching
- [x] Driver details display
- [x] Order status tracking (real-time)
- [x] Rating system
- [x] Ride history
- [x] User profile management
- [x] PWA capabilities (install prompts, offline support)

### 🔜 Fast Follow (Next 2-4 weeks)

- [ ] Scheduled rides functionality (full implementation)
- [ ] Trip Tracker with real-time location (socket.io integration)
- [ ] Push notifications for order updates
- [ ] Payment integration (M-Pesa)
- [ ] Enhanced error handling and retry logic
- [ ] Analytics dashboard for drivers

### 📅 Phase 2 (Month 2-3)

- [ ] Housing integration (full unified flow)
- [ ] Driver app (separate application)
- [ ] Advanced scheduling (recurring orders)
- [ ] Referral program
- [ ] Promotional campaigns
- [ ] Multi-language support (Swahili)

### 📅 Phase 3 (Month 4-6)

- [ ] Expansion to other African countries
- [ ] B2B enterprise features
- [ ] API for third-party integrations
- [ ] Advanced analytics and reporting
- [ ] Machine learning for demand prediction

---

## 🎨 **9. UI/Design Guidelines**

### 9.1 Design Philosophy: Bolt-Inspired Simplicity

**Core Principles:**
- **Speed**: Minimal clicks, instant feedback, fast load times
- **Simplicity**: Clean interface, no clutter, intuitive navigation
- **Reliability**: Consistent UI patterns, clear error states, transparent information

### 9.2 Color System

**Primary Brand Color: Swyft Green**

Swyft's signature green (`#00d46a`) represents growth, movement, and reliability—perfect for a logistics platform.

#### Light Mode Palette

| Role | Color Name | Hex | Usage |
|------|-----------|-----|-------|
| **Primary** | Swyft Green | `#00d46a` | Primary buttons, brand accents, success states |
| **Primary Hover** | Deep Green | `#00c059` | Button hover states |
| **Primary Dark** | Forest Green | `#18b700` | Links, icons, secondary accents |
| **Background** | Pure White | `#ffffff` | Main page background |
| **Surface** | Light Gray | `#f5f5f5` | Cards, modals, elevated surfaces |
| **Surface Alt** | Off White | `#fafafa` | Secondary cards, hover states |
| **Text Primary** | Charcoal | `#2d2926` | Headlines, body text |
| **Text Secondary** | Medium Gray | `#6b635b` | Captions, muted text |
| **Text Muted** | Light Gray | `#9c948a` | Placeholders, disabled text |
| **Border** | Border Gray | `#e0d8cc` | Dividers, input borders |
| **Error** | Error Red | `#f44336` | Error states, cancel actions |
| **Warning** | Warning Orange | `#ff9500` | Warning states, alerts |

#### Dark Mode Palette (Future)

| Role | Color Name | Hex | Usage |
|------|-----------|-----|-------|
| **Primary** | Swyft Green | `#00d46a` | Primary buttons (unchanged for brand consistency) |
| **Primary Hover** | Light Green | `#33dd7a` | Button hover states |
| **Background** | Dark Gray | `#1a1a1a` | Main page background |
| **Surface** | Surface Dark | `#252525` | Cards, modals |
| **Text Primary** | Light Text | `#ffffff` | Headlines, body text |
| **Text Secondary** | Medium Light | `#b0b0b0` | Captions, muted text |

#### CSS Variables

```css
:root {
  /* Primary Colors */
  --swyft-green: #00d46a;
  --swyft-green-hover: #00c059;
  --swyft-green-dark: #18b700;
  
  /* Background & Surface */
  --background: #ffffff;
  --surface: #f5f5f5;
  --surface-alt: #fafafa;
  
  /* Text */
  --text-primary: #2d2926;
  --text-secondary: #6b635b;
  --text-muted: #9c948a;
  
  /* Borders & Dividers */
  --border: #e0d8cc;
  
  /* Status Colors */
  --success: #00d46a;
  --error: #f44336;
  --warning: #ff9500;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}

[data-theme='dark'] {
  --background: #1a1a1a;
  --surface: #252525;
  --text-primary: #ffffff;
  --text-secondary: #b0b0b0;
  --border: #3d3835;
}
```

### 9.3 Typography

**Font Family**: Montserrat (Google Fonts)

| Element | Weight | Size | Line Height | Usage |
|---------|--------|------|-------------|-------|
| **H1** | 700 (Bold) | 2.5rem (40px) | 1.2 | Page titles |
| **H2** | 700 (Bold) | 2rem (32px) | 1.3 | Section headers |
| **H3** | 500 (Medium) | 1.5rem (24px) | 1.4 | Subsection headers |
| **Body** | 400 (Regular) | 1rem (16px) | 1.5 | Body text |
| **Body Small** | 400 (Regular) | 0.875rem (14px) | 1.5 | Captions, labels |
| **Button** | 500 (Medium) | 1rem (16px) | 1.5 | Button text |
| **Input** | 400 (Regular) | 1rem (16px) | 1.5 | Form inputs |

### 9.4 Component Guidelines

#### Buttons

**Primary Button:**
```css
.button-primary {
  background-color: var(--swyft-green);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: var(--spacing-md) var(--spacing-lg);
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.button-primary:hover {
  background-color: var(--swyft-green-hover);
}
```

**Secondary Button:**
```css
.button-secondary {
  background-color: transparent;
  color: var(--swyft-green);
  border: 2px solid var(--swyft-green);
  border-radius: var(--radius-md);
  padding: var(--spacing-md) var(--spacing-lg);
}
```

#### Cards

- **Elevation**: Subtle shadow (`--shadow-md`)
- **Border Radius**: `--radius-lg` (12px)
- **Padding**: `--spacing-lg` (24px)
- **Background**: `--surface` (#f5f5f5)

#### Input Fields

- **Border**: 1px solid `--border`
- **Border Radius**: `--radius-md`
- **Padding**: `--spacing-md`
- **Focus State**: 2px solid `--swyft-green` outline

### 9.5 Spacing System

Use consistent spacing scale:
- **XS**: 4px (tight spacing)
- **SM**: 8px (compact)
- **MD**: 16px (default)
- **LG**: 24px (comfortable)
- **XL**: 32px (generous)

### 9.6 Animation Guidelines

**Bolt-Inspired Speed:**
- **Fast transitions**: 150-200ms for micro-interactions
- **Standard transitions**: 300ms for state changes
- **Slow transitions**: 500ms for page transitions

**Easing**: `ease-out` for most animations (feels snappy)

### 9.7 Mobile-First Design

- **Touch targets**: Minimum 44x44px
- **Responsive breakpoints**:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

---

## ⚠️ **10. Risks & Mitigations**

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| **Driver availability** | High | Medium | 30-second timeout with retry option; expand driver network |
| **Real-time sync failures** | High | Low | Fallback to polling; error handling with user notifications |
| **Pricing disputes** | Medium | Medium | Transparent pricing display; clear terms before booking |
| **Geolocation accuracy** | Medium | Medium | Allow manual location input; use reverse geocoding for verification |
| **Network connectivity** | High | Medium | PWA offline support; cached critical data |
| **Payment integration delays** | Medium | Low | Start with cash-on-delivery; integrate M-Pesa in Phase 2 |
| **Housing integration complexity** | Low | Medium | Phased approach; start with landing page, full integration later |

---

## 📝 **11. Open Questions**

1. **Payment Integration Priority**: Should M-Pesa integration be MVP or Phase 2?
2. **Driver App Timeline**: When should driver-facing app development begin?
3. **Housing Integration Depth**: Full integration in Swyft app or maintain separate service?
4. **International Expansion**: Which countries should be prioritized after Kenya?
5. **Pricing Strategy**: Should we introduce surge pricing during peak hours?
6. **Loyalty Program**: Should we implement a points/rewards system?
7. **Corporate Accounts**: When to introduce B2B features for businesses?

---

## 📚 **12. Additional Context**

### 12.1 Backend Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/login` | POST | User authentication |
| `/signup` | POST | User registration |
| `/check_session` | GET | Token verification |
| `/orders` | GET/POST | List/create orders |
| `/orders/:id` | PUT | Update order status |
| `/driver/:id` | GET | Fetch driver details |
| `/rating/driver/:id` | POST | Submit driver rating |
| `/customer/profile` | PUT | Update user profile |
| `/schedule` | POST | Schedule future ride |

### 12.2 Vehicle Types & Pricing Details

**Base Rates (Ksh/km):**
- SwyftBoda: 30
- SwyftBodaElectric: 20
- Car: 50
- Van: 210
- MiniTruck: 270
- Pickup: 220
- Car Rescue: 400
- Lorry 5 Tonne: 800
- Lorry 10 Tonne: 1,200

**Distance Tiers:**
- < 2 km: 3.5x base rate
- < 3 km: 3.0x base rate
- < 5 km: 2.5x base rate
- < 10 km: 1.2x base rate
- > 10 km: Exponential decay (minimum Ksh 50/km)

**Minimum Fare**: Ksh 1,000 for cargo vehicles (except car, Swyft Boda)

**Loader Service**: Ksh 600 per loader (optional add-on)

### 12.3 Environment Variables

| Variable | Purpose |
|---------|---------|
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API key |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_KEY` | Supabase anon/public key |

### 12.4 Code Conventions

- **Components**: Functional components with hooks
- **State Management**: Redux Toolkit for global state
- **Styling**: Component-specific CSS files
- **Environment Variables**: `import.meta.env.VITE_*`
- **Authentication**: JWT tokens in secure cookies (`authTokencl1`)
- **Error Handling**: Try-catch blocks with user-friendly messages

---

**End of PRD**
