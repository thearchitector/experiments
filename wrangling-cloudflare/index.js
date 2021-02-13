/**
 * Cloudflare Fullstack Engineering Intership Challenge
 *
 * @author: Elias
 */
const API_ENDPOINT = "https://cfw-takehome.developers.workers.dev/api/variants";
const VARIANT_REQUEST = new Request(API_ENDPOINT);

const COOKIE_NAME = "_wrangling_cloudflare_variant";
const COOKIE_REGEX = new RegExp(`${COOKIE_NAME}=(.+?)(?=;?\\s|$)`, 'm');

const ERROR_MSGS = [ // to add a little fun to getting an error
	"Something has not gone as planned...",
	"Oh noes!",
	"You are here, but the page is not.",
	"We promise, there really should be a response here...",
	"Clearly, someone took a wrong turn."
];


/**
 * Modifies the variant response using HTMLRewriter and returns the new
 * Response object.
 *
 * @param {Response} response
 */
function modifyResponse(response) {
	// overwrite DOM elements with custom messages
	let modifier = new HTMLRewriter().on('p#description', {
		element(e) {
			e.setInnerContent("Congratulations! There were two paths in the woods, equally traveled, and you took one of them. I think that's how it goes at least...")
		}
	}).on('title', {
		element(e) {
			e.setInnerContent("Variant Paths")
		}
	}).on('a#url', {
		element(e) {
			e.setAttribute('href', 'https://github.com/thearchitector');
			e.setInnerContent('<div class="text-center"><img width="32" style="display:inline-block !important" src="https://upload.wikimedia.org/wikipedia/commons/9/95/Font_Awesome_5_brands_github.svg"><span class="pl-2 align-middle">Visit Elias on GitHub</span></div>', { html: true });
		}
	});

	// transform the old response and return it
	return modifier.transform(response);
}


/**
 * Distribute the possible responses a list of known endpoints, sending the
 * same response if the client is recurring.
 *
 * @param {Request} request
 */
async function distributeRequest(request) {
	// wrap everything in a try-catch to ensure we're always returning a response
	try {
		let cookies = request.headers.get('Cookie') || "";

		// if this is returning client, use the same variant as stored in the cookie
		if(cookies.includes(COOKIE_NAME)) {
			// extract the cookie with regex and a capture group
			let url = cookies.match(COOKIE_REGEX)[1];
			// returning user, so give them the same site variant as before
			return modifyResponse(await fetch(url));
		}

		// fetch the list of variants synchronously
		let response = await fetch(VARIANT_REQUEST);
		if(!response.ok) throw new Error(':('); // if something goes wrong, throw an error
		let variants = (await response.json()).variants;

		// it might turn out that we want A/B/C testing, in which case we will want
		// to equally distribute the load to C as well. Select a random variant index
		// based on the number of variants
		let server = Math.floor(Math.random() * variants.length);
		let url = variants[server];
		let resp = await fetch(url);

		// make a copy, since fetch return a Response with immutable headers
		resp = new Response(resp.body, resp);
		// include the current variant as a cookie
		resp.headers.set("Set-Cookie", `${COOKIE_NAME}=${url}`);

		return modifyResponse(resp);
	}
	catch(error) {
		let msgIdx = Math.floor(Math.random() * ERROR_MSGS.length);
		return new Response(`${ERROR_MSGS[msgIdx]} Please try again later.`, { headers: { 'content-type': "text/plain; charset=utf-8"}, status: 500 });
	}
}

addEventListener('fetch', event => event.respondWith(distributeRequest(event.request)));