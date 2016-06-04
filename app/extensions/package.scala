package object extensions {

  implicit class TraversableExtensions[A](val xs: Traversable[A]) extends AnyVal {
    
    def sumBy[B](f: A => B)(implicit num: Numeric[B]): B = {
      var sum = num.zero
      for (x <- xs) sum = num.plus(sum, f(x))
      sum
    }

    def sumByCond[B](f: A => B)(p: A => Boolean)(implicit num: Numeric[B]): B = {
      var sum = num.zero
      for (x <- xs if p(x)) sum = num.plus(sum, f(x))
      sum
    }

  }

}