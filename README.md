Flatten a React "pyramid of doom" by composing multiple layers into a single component.

## Getting Started

If you've ever built a react app, you've probably seen the following pyramid of context providers. Contexts are useful for injecting shared configuration in one place, but they can stack up pretty deep.

```tsx
render(
  <Router history={history}>
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <ReduxProvider store={store}>
          <App />
        </ReduxProvider>
      </I18nextProvider>
    </ThemeProvider>
  </Router>
)
```

To avoid a pyramid, use the `collate` fluent API to compose many wrappers into a single component. The following example creates the same React tree that is shown above.

```tsx
import { collate } from 'react-collate';

export interface IProviderProps {
  history: History;
  theme: Theme;
  i18n: I18n;
  store: Store;
}

export const Provider = collate<IProviderProps>()
  .add(({ history, children }) => <Router history={history}>{children}</Router>)
  .add(({ theme, children }) => <ThemeProvider theme={theme}>{children}</Router>)
  .add(({ i18n, children }) => <I18nextProvider i18n={i18n}>{children}</I18nextProvider>)
  .add(({ store, children }) => <ReduxProvider store={store}>{children}</ReduxProvider>)
  .build();
```

No more pyramids, your app configuration is nicely contained, and it can even be reused.

```tsx
render(
  <Provider history={history} theme={theme} i18n={i18n} store={store}>
    <App />
  </Provider>
);
```
