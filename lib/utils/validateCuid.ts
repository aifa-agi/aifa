export function isValidCuid(id: string): boolean {
  // Проверяем, что строка состоит из 24 латинских букв/цифр
  return /^[a-z0-9]{24}$/i.test(id);
}
