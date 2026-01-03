# Design Guidelines: University Event Platform (FIMAZ)

## Design Approach

**Hybrid System**: Combining **Linear's** clean information architecture + **Instagram's** social engagement patterns + **Notion's** hierarchical organization, creating an academic-focused platform that balances utility with student engagement.

**Rationale**: This platform requires both efficient information delivery (events, schedules) and social interaction (likes, comments, follows). The design must feel modern and approachable for students while maintaining institutional credibility.

---

## Typography System

**Font Families**:
- **Primary**: Inter (headings, UI elements, buttons)
- **Secondary**: System UI (body text, descriptions, comments)

**Hierarchy**:
- Event Titles: text-2xl to text-3xl, font-semibold
- Section Headers: text-xl, font-semibold
- Body Content: text-base, font-normal
- Metadata/Stats: text-sm, text-xs for timestamps
- Admin Dashboard: text-lg for section titles, text-base for data

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 8, 12, 16**
- Component padding: p-4, p-6
- Section spacing: gap-8, space-y-12
- Card margins: m-4
- Tight elements: gap-2

**Grid Structure**:
- Mobile: Single column, full-width cards
- Tablet/Desktop: Event cards in 2-column grid for feed view
- Admin Dashboard: 3-4 column metrics grid

**Max Widths**:
- Public/Student Feed: max-w-4xl mx-auto
- Event Detail: max-w-3xl mx-auto
- Admin Dashboard: max-w-7xl mx-auto

---

## Component Library

### Navigation
**Public/Student Header**:
- Fixed top navigation with backdrop blur
- Logo left, category filters center (pills/tabs), login/profile right
- Mobile: Hamburger menu with slide-out drawer
- Active state indicators for current category

**Admin Sidebar**:
- Persistent left sidebar (desktop), collapsible (mobile)
- Sections: Dashboard, Events, Users, Moderation, Metrics
- Icon + label format, active state with subtle background

### Event Cards (Feed View)
- Rounded corners (rounded-lg)
- Event image aspect ratio 16:9 or 4:3
- Overlay gradient on image with title/category
- Below image: date, location (icons + text)
- Engagement row: "Asistiré" button, like count, comment count
- Hover: Subtle lift shadow (shadow-lg transition)

### Event Detail Page
- Hero image full-width
- Content section max-w-3xl:
  - Category badge
  - Title (text-3xl, font-bold)
  - Date/time/location with icons
  - "Asistiré" primary button + attendee count
  - Description (prose format)
  - Engagement: Like button, share options
- Comments Section:
  - Input field pinned at top or bottom
  - Comments list with avatar, name, timestamp, content
  - Thread-style layout

### Admin Dashboard
**Metrics Cards Grid**:
- 4-column grid (responsive: 2-col tablet, 1-col mobile)
- Each card: Icon, large number, label, trend indicator
- Cards: Total Events, Active Users, Total Interactions, Top Event

**Event Management Table**:
- Sortable columns: Title, Category, Date, Status, Actions
- Row actions: Edit (pencil), Delete (trash), Archive (box)
- Filters: Category dropdown, date range, status toggle

**User Management**:
- Table view with: Name, Email, Role (badge), Status, Actions
- "Create User" button (primary, top-right)
- Role badges: Admin (distinct badge), Student (standard badge)

**Create Account Modal**:
- Form fields: Name, Email, Role (dropdown: Student/Admin)
- Auto-generate password option + manual entry
- Submit creates account immediately

### Social Features
**Follow Button**:
- Small, rounded button with icon
- States: "Follow" / "Following"
- Follower count display nearby

**Chat Interface**:
- Slide-out panel or dedicated page
- Contact list left, conversation right
- Message bubbles (sent/received differentiation)
- Input at bottom with send button

**Notifications Panel**:
- Dropdown from bell icon (header)
- List of notifications with icons, message, timestamp
- Unread indicator (badge number)
- Mark as read on click

### Forms
**Input Fields**:
- Consistent height (h-12)
- Rounded borders (rounded-md)
- Focus states with ring
- Labels above fields (text-sm, font-medium)
- Helper text below (text-xs)

**Buttons**:
- Primary: Solid background, rounded-md, px-6 py-3
- Secondary: Outline style
- Danger: For delete actions
- Icon buttons: Square, centered icon

### Category Filters
- Pill-shaped buttons (rounded-full)
- Horizontal scroll on mobile
- Icons + labels for: Académico, Cultural, Deportivo, Todos
- Active state clearly differentiated

---

## Animations

**Minimal Approach**:
- Card hover: transform scale-105, shadow transition (duration-200)
- Button clicks: active:scale-95
- Page transitions: Simple fade (no complex animations)
- Modal entry: Fade + slight scale from center
- **No scroll-triggered animations**

---

## Accessibility

- Focus rings on all interactive elements (ring-2)
- ARIA labels for icon-only buttons
- Semantic HTML (nav, main, article, aside)
- Sufficient contrast for text
- Touch targets minimum 44x44px (mobile)

---

## Images

**Event Images**:
- Required for all events (placeholder if none)
- Optimized dimensions: 1200x675px (16:9) or 1200x900px (4:3)
- Hero images on event detail pages: Full-width, aspect-16/9
- Feed card images: Consistent aspect ratio across grid
- Overlay treatment: Linear gradient from transparent to dark on bottom third for text legibility

**No large hero** on homepage - lead with event grid immediately after navigation.

**User Avatars**:
- Circular, consistent sizes: 32px (comments), 40px (profiles), 24px (small)
- Default placeholder: Initials on solid background

**Admin Dashboard**:
- Icon-based metric cards (no imagery)
- Charts/graphs for metrics visualization (bar charts, line graphs)

---

## Responsive Behavior

**Mobile (< 768px)**:
- Stack all multi-column layouts
- Bottom navigation for primary actions
- Collapsible filters/sidebar
- Full-width event cards

**Tablet (768px - 1024px)**:
- 2-column event grid
- Sidebar visible but narrower

**Desktop (> 1024px)**:
- Full layout with persistent sidebar (admin)
- 2-3 column event grid maximum
- Spacious padding and margins

---

## Key Screens Layout

**Public Feed**: Navigation → Category Filters → Event Grid (2-col desktop) → Footer
**Event Detail**: Navigation → Hero Image → Content Section → Comments → Footer  
**Student Dashboard**: Navigation → "My Events" Section → Recommended Events → Footer
**Admin Dashboard**: Sidebar → Metrics Grid → Recent Events Table → Quick Actions
**Admin User Management**: Sidebar → Header with "Create User" → Users Table → Pagination