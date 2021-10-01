import { render } from '@testing-library/react';
import React, { createContext, ReactNode, useContext } from 'react';
import { collate } from '..';

test('render', () => {
  const A = createContext('');
  const B = createContext('');
  const C = createContext('');

  const AProvider = (props: { value: string; children?: ReactNode }) => {
    return <A.Provider value={props.value + useContext(B)}>{props.children}</A.Provider>;
  };

  const Provider = collate<{ a: string; b: string; c: string }>()
    .add(({ c, children }) => <C.Provider value={c}>{children}</C.Provider>)
    .add(({ b, children }) => <B.Provider value={b}>{children}</B.Provider>)
    .add(({ a, children }) => <AProvider value={a}>{children}</AProvider>)
    .build();

  const Test = () => {
    const a = useContext(A);
    const b = useContext(B);
    const c = useContext(C);

    return <div>{JSON.stringify({ a, b, c })}</div>;
  };

  const { container, rerender } = render(
    <Provider a={'a'} b={'b'} c={'c'}>
      <Test />
    </Provider>,
  );

  expect(container.firstChild).toMatchInlineSnapshot(`
    <div>
      {"a":"ab","b":"b","c":"c"}
    </div>
  `);

  rerender(
    <Provider a={'1'} b={'2'} c={'3'}>
      <Test />
    </Provider>,
  );

  expect(container.firstChild).toMatchInlineSnapshot(`
    <div>
      {"a":"12","b":"2","c":"3"}
    </div>
  `);
});

test('render empty', () => {
  const Provider = collate().build();
  const { container } = render(<Provider />);

  expect(container.firstChild).toMatchInlineSnapshot(`null`);
});
