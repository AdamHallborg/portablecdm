const redirectURI = 'http://localhost:1337/authing.html';
const clientID = '0.1-urn:mrn:stm:service:instance:viktoria:portablecdm';
const baseURI = 'https://maritimeid.maritimecloud.net/auth';

/**STAGING */
const staging = {
    redirectURI: 'http://localhost:1337/authing.html',
    clientID: '0.1-urn:mrn:stm:service:instance:viktoria:portablecdm',
    baseURI: 'https://staging-maritimeid.maritimecloud.net/auth',
}

export default function constants(isStaging) {
    return {
        RedirectURI: isStaging ? staging.redirectURI : redirectURI,
        ClientID: isStaging ? staging.clientID : clientID,
        MaritimeAuthURI: `${isStaging ? staging.baseURI : baseURI}/realms/MaritimeCloud/protocol/openid-connect/auth?client_id=${isStaging ? staging.clientID : clientID}&redirect_uri=${isStaging ? staging.redirectURI : redirectURI}&response_mode=fragment&response_type=code&scope=openid`,
        MaritimeTokenURI: `${isStaging ? staging.baseURI : baseURI}/realms/MaritimeCloud/protocol/openid-connect/token`,
        MaritimeLogoutURI: `${isStaging ? staging.baseURI : baseURI}/realms/MaritimeCloud/protocol/openid-connect/logout?redirect_uri=${encodeURIComponent(isStaging ? staging.redirectURI : redirectURI)}`,
    }
}

//For testing
//https://staging-maritimeid.maritimecloud.net/auth/realms/MaritimeCloud/protocol/openid-connect/auth?client_id=0.1-urn:mrn:stm:service:instance:viktoria:portablecdm-app&redirect_uri=http://localhost:1337/redirect/&response_mode=fragment&response_type=code&scope=openid