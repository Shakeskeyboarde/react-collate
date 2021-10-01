import { ComponentType, createElement, Fragment, PropsWithChildren, ReactElement } from 'react';

export interface ICollator<TProps> {
  /**
   * Add a new _inner-most_ component layer.
   */
  add(renderChild: (props: TProps) => ReactElement): ICollator<TProps>;
  /**
   * Return a single component which internally includes all of the composed
   * component layers, nested in the order (outer to inner) they were added.
   */
  build(): ComponentType<TProps>;
}

/**
 * Compose many elements into a single component.
 *
 * ```tsx
 * export const Provider = collate<IProviderProps>()
 *   .add(({ history, children }) => <Router history={history}>{children}</Router>)
 *   .add(({ theme, children }) => <ThemeProvider theme={theme}>{children}</Router>)
 *   .add(({ i18n, children }) => <I18nextProvider i18n={i18n}>{children}</I18nextProvider>)
 *   .add(({ store, children }) => <ReduxProvider store={store}>{children}</ReduxProvider>)
 *   .build();
 * ```
 */
export function collate<TProps extends {} = {}>(
  render?: (props: PropsWithChildren<TProps>) => ReactElement,
): ICollator<PropsWithChildren<TProps>> {
  return render != null
    ? {
        add(renderChild) {
          return collate((props) => render({ ...props, children: renderChild(props) }));
        },
        build() {
          return function Collated(props: PropsWithChildren<TProps>): ReactElement {
            return render(props);
          };
        },
      }
    : {
        add(renderChild) {
          return collate(renderChild);
        },
        build() {
          return function Collated({ children }: PropsWithChildren<TProps>): ReactElement {
            return createElement(Fragment, undefined, children);
          };
        },
      };
}
