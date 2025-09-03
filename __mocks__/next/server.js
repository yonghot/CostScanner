// Mock implementation of next/server for testing

class NextResponse extends Response {
  static json(data, init = {}) {
    const response = new Response(JSON.stringify(data), {
      ...init,
      headers: {
        'content-type': 'application/json',
        ...Object.fromEntries(new Headers(init?.headers || {})),
      },
    })
    
    // Override json method to return the original data
    response.json = async () => data
    
    return response
  }
  
  static redirect(url, status = 307) {
    return new Response(null, {
      status,
      headers: {
        Location: url.toString(),
      },
    })
  }
}

class NextRequest extends Request {
  constructor(input, init) {
    super(input, init)
    
    // Parse URL
    const url = typeof input === 'string' ? input : input.url
    this.nextUrl = new URL(url || 'http://localhost:3000')
    
    // Add cookies property
    this.cookies = {
      get: (name) => null,
      set: () => {},
      delete: () => {},
    }
    
    // Add geo property
    this.geo = {
      city: '',
      country: '',
      region: '',
      latitude: '',
      longitude: '',
    }
  }
}

module.exports = {
  NextRequest,
  NextResponse,
}