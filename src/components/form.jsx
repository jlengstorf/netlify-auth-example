import { useState } from 'preact/hooks';
import styles from '../styles/form.module.css';

export default function Form() {
  const [data, setData] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const form = new FormData(event.target);

    const name = form.get('name');

    const response = await fetch('/.netlify/functions/party', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });

    if (response.status !== 200) {
      const data = await response.json();

      console.log(data);

      setData({ error: true, message: data.message });
      return;
    }

    const data = await response.json();

    setData({ error: false, name: data.name });
  }

  let msg = 'Do you like to party?';

  if (data && !data.error) {
    msg = `${data.name} likes to party!`;
  } else if (
    data &&
    data.error &&
    data.message.match(/no active device found/i)
  ) {
    msg =
      'Make sure Spotify is open and active. Click play and pause on a song to make sure it’s ready.';
  } else {
    msg = data.message;
  }

  return (
    <section class={styles.section}>
      <div>
        <p>{msg}</p>
      </div>
      <form class={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="name" class={styles.label}>
          Name
        </label>
        <input id="name" name="name" type="text" class={styles.input} />

        <button class={styles.button}>Party!</button>
      </form>
      {data && (
        <div>
          <h2>Debug Info:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </section>
  );
}
