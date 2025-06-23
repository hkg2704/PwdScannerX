document.getElementById("checkBtn").addEventListener("click", async () => {
  const pwd = document.getElementById("pwdInput").value;
  const result = document.getElementById("result");
  const warning = document.getElementById("warning");

  result.innerText = "";
  warning.innerText = "";

  const strength = checkStrength(pwd);
  const isLeaked = await checkPwned(pwd);

  let msg = `Strength: ${strength}/5. `;
  msg += isLeaked ? " Found in breaches!" : " Safe from leaks.";
  result.innerText = msg;

  if (strength < 3) {
    warning.innerText = " Try a stronger password!";
  }
});

function checkStrength(pwd) {
  let strength = 0;
  if (pwd.length >= 12) strength++;
  if (/[A-Z]/.test(pwd)) strength++;
  if (/[a-z]/.test(pwd)) strength++;
  if (/[0-9]/.test(pwd)) strength++;
  if (/[^A-Za-z0-9]/.test(pwd)) strength++;
  return strength;
}

async function checkPwned(password) {
  const sha1 = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(password));
  const hash = Array.from(new Uint8Array(sha1)).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);

  const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
  const data = await res.text();
  return data.includes(suffix);
}
