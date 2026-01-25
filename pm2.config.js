module.exports = {
  apps : [{
    name: "hellojenkins-web-local",
    script: "npm",
    args: "run start",
    env: {
      PORT: 8082
    }
  }]
}