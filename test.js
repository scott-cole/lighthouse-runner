async function fetchUrl(url) {
  const response = await fetch(url);

  if (response.ok) {
    const text = await response.text();
    console.log(text.length);
  } else {
    console.log("Failed with status " + response.status);
  }
}

fetchUrl("https://example.com");
