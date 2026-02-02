// const defaultConfig = {
//   port: 8765,
//   enabled: true
// }

class Storage {
  static initializeStorage (): void {
    try {
      const testKey = '__storage_test__'
      localStorage.setItem(testKey, 'test')
      localStorage.removeItem(testKey)
    } catch (error) {
      console.error('LocalStorage is not available:', error)
    }
  }

  static getItem (key: string): string | null {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  }

  static setItem (key: string, value: string): void {
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      console.error('Error setting item in localStorage:', error)
    }
  }

  static removeItem (key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing item from localStorage:', error)
    }
  }
}

export default Storage
