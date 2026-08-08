 //  Hero role text animation
const heroRoleText = document.querySelector("#heroRoleText");

if (heroRoleText) {
  const roles = ["Frontend Developer", "Mechatronics Engineering"];
  let roleIndex = 0;
  const TYPE_SPEED = 85;
  const DELETE_SPEED = 55;
  const AFTER_TYPE_DELAY = 1800;
  const AFTER_DELETE_DELAY = 450;
  async function typeText(text) {
    heroRoleText.textContent = "";
    for (let i = 0; i < text.length; i++) {
      heroRoleText.textContent += text[i];
      await new Promise((resolve) => setTimeout(resolve, TYPE_SPEED));
    }
  }

  async function deleteText() {
    const currentText = heroRoleText.textContent;
    for (let i = currentText.length; i > 0; i--) {
      heroRoleText.textContent = currentText.slice(0, i - 1);
      await new Promise((resolve) => setTimeout(resolve, DELETE_SPEED));
    }
  }

  async function runRoleAnimation() {
    while (true) {
      const currentRole = roles[roleIndex];
      await typeText(currentRole);
      await new Promise((resolve) => setTimeout(resolve, AFTER_TYPE_DELAY));
      await deleteText();
      await new Promise((resolve) => setTimeout(resolve, AFTER_DELETE_DELAY));
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  runRoleAnimation();
}
