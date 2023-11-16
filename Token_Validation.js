function isTokenExpired(token) {
    if (!token) {
        return true;
    }

    const tokenData = parseJwt(token);

    if (!tokenData || !tokenData.exp) {
        return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);

    console.log(tokenData.exp)
    console.log(currentTime)
    return tokenData.exp < currentTime;
}

function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
        return null;
    }
}

// Example usage
const accessToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Imh3VmZFUjNhb19qd0NaNGlpZ3ZIMiJ9.eyJpc3MiOiJodHRwczovL2Rldi00aXN2bnNxMGFrdGJkbm4wLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJGOUdSWUM5V1hEdll6ZldDU2JBbEhMdWR4ckh2MFg0ZkBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9kZXYtNGlzdm5zcTBha3RiZG5uMC51cy5hdXRoMC5jb20vYXBpL3YyLyIsImlhdCI6MTcwMDEzNTIzNiwiZXhwIjoxNzAwMjIxNjM2LCJhenAiOiJGOUdSWUM5V1hEdll6ZldDU2JBbEhMdWR4ckh2MFg0ZiIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.j3eIHNgQ23OM9NxoVo6P1od4lQdSqbVy5fgRyOIONjJvU4xrB8D6DiO3KYlOxiwmM62x-TXLVgjZFwU5-Trd-A31VpVfyw90mdrw7NFXIqUULfE7iqdffA9IptH6MMjQaybN5OP8fpUiako-w2DPT2QFfwLH1UnS-RSj64pmishXscE1k9WsNvxiEiiFKjLXeyCG9qihg303S-3HLB_zNRLFQF11EfzcA0AHGzzdqHL9RoexF-tIpyrqkFgT1pjl12WIV9RAeYLPvSe25yHN1k7iFhPoRq3ESXcTJ2D277ih40b8emToap6_WqmcPjZQuRVfWK1GQ8xNByJdtB2RiA';

if (isTokenExpired(accessToken)) {
    console.log('The token is expired.');
}
else {
    console.log('The token is still valid.');
}
