declare module "mongoose" {
  namespace Types {
    class Html extends String {}
    class Email extends String {}
  }

  namespace Schema {
    namespace Types {
      class Html extends String {}
      class Email extends String {}
    }
  }
}
