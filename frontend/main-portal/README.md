---
Asset Classification: CONFIDENTIAL
Project: FS Intern
---

# FS Intern

## Prerequisites

- **Node.js**: Ensure you have Node.js installed on your system.

  **Required Version**: `>=20`  
  You can download the latest version of Node.js from [https://nodejs.org/](https://nodejs.org/).

- **pnpm**: Comes with Node.js. If you have Node.js installed, pnpm should be available.

Check your current Node.js and pnpm versions with the following commands:

```bash
node -v
pnpm -v
```

## Installation

Install package dependencies using [pnpm](https://pnpm.io/):

```bash
pnpm install
```

## Start Development

To develop and run your application, you need to run following command:

```bash
pnpm run dev
```

## Build

To build your application, you need to run following command:

```bash
pnpm run build
```

## Codegen

To generate Graphql type from server/client schema

```bash
pnpm run codegen
```

## Project structures

```
/src
  /assets               # Static assets like images, fonts, etc.
  /components           # Reusable UI components
  /config               # Configuration files (e.g., for environment variables)
  /constants            # Constant files
  /hooks                # Custom React hooks
  /interfaces           # Stores global TypeScript types and interfaces
  /layouts              # Layout components (for structuring pages)
  /pages                # Page-level components (routes)
  /routes               # Define routes
  /services             # API calls, external services
  /store                # State management (e.g., Redux, Zustand, etc.)
  /styles               # Global/shared styles (CSS, SASS, or styled components)
  /utils                # Utility functions and helpers
  /app.tsx              # Main app component
  /main.tsx             # React DOM render entry point
```

```
/components
  /button
    style.scss        # Styles
    helper.ts         # Component complex logic
    index.ts          # Component
```

## Component structures

```
const Dashboard = (props: IProps) => {
  // define state
  const [loading, setLoading] = useState<boolean>(false);

  // define function
  const onFetchData = async () => {};
  const onClick = () => {};

  // define hook
  useEffect(() => {}, []);

  // render UI
  return (
    <div className={classnames('dashboard', props.className)}>
      {loading ? 'loading' : 'dashboard'}
    </div>
  );
};
```
