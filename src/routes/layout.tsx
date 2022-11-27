import { component$, Slot } from '@builder.io/qwik';
import Header from '../components/header/header';

export default component$(() => {
  return (
    <>
      <main class="min-w-full mx-auto min-h-screen grid place-items-center">
        <section>
          <Slot />
        </section>
      </main>
    </>
  );
});
