module.exports = {
  type: 'array',
  items: {
    type: 'object',
    required: ["name"],
    properties: {
      name: {
        type: 'string'
      },
      white: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            text: {
              type: 'string'
            }
          }
        }
      },
      black: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            text: {
              type: 'string'
            },
            pick: {
              type: 'integer'
            }
          }
        }
      }
    }
  }
}