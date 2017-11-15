module.exports = babel => {
  var t = babel.types;
  return {
    name: "s2s-redux-actions-sagas",
    visitor: {
      Program: {
        exit(path, state) {
          const program = path.find(parent => parent.isProgram())

          const tryCatch = t.TryStatement(
            t.BlockStatement([
              t.VariableDeclaration(
                "const",
                [t.VariableDeclarator(
                  t.ObjectPattern([
                    t.ObjectProperty(
                      t.Identifier("data"),
                      t.Identifier("data"),
                      false,
                      true
                    )
                  ]),
                  t.YieldExpression(
                    t.CallExpression(
                      t.Identifier("call"),
                      [
                        t.MemberExpression(t.Identifier("api"),t.Identifier("createContact")),
                        t.MemberExpression(t.Identifier("action"),t.Identifier("payload"))
                      ]
                    )
                  )
                )]
              ),
              t.ExpressionStatement(
                t.YieldExpression(
                  t.CallExpression(
                    t.Identifier("put"),
                    [t.CallExpression(
                      t.MemberExpression(t.Identifier("contactActions"),t.Identifier("createContactSuccess")),
                      [t.Identifier("data")]
                    )]
                  )
                )
              )
            ]),
            t.CatchClause(
              t.Identifier("error"),
              t.BlockStatement([
                t.ExpressionStatement(
                  t.YieldExpression(
                    t.CallExpression(
                      t.Identifier("put"),
                      [t.CallExpression(
                        t.MemberExpression(
                          t.identifier("contactActions"),t.Identifier("createContactFailure")
                        ),
                        [t.Identifier("error")]
                      )]
                    )
                  )
                )
              ])
            )
          )

           const data = t.ExportNamedDeclaration(
            t.FunctionDeclaration(
              t.Identifier("handleCreateContact"),
              [t.Identifier("action")],
              t.BlockStatement([
                tryCatch
              ]),
              true
            ),[]
           )
          program.node.body.push(
            data
          )
        }
      }
    }
  }
}
