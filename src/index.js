// import {
//   template
// } from 's2s-utils'

// const builders = {
//   root: template(`export default OBJ`)
// }

module.exports = babel => {
  var t = babel.types;
  return {
    name: "s2s-redux-actions-sagas",
    visitor: {
      Program: {
        exit(path, state){
          const actions = []
          const program = path.find(parent => parent.isProgram())
          path.traverse({
            FunctionDeclaration(path){
              const handleName = path.node.id.name
              const actionName = handleName.replace(/handle/, '').charAt(0).toLowerCase() + handleName.replace(/handle/, '').slice(1)

              const callExpresion =t.CallExpression(
                t.Identifier("takeLatest"),
                [t.CallExpression(
                  t.MemberExpression(
                    t.MemberExpression(
                      t.Identifier("actions"),
                      t.Identifier(actionName)
                    ),
                    t.Identifier("toString")
                  ),
                  []
                ),
                t.Identifier(handleName)]
              )
              actions.push(callExpresion)
            },
            ExportDefaultDeclaration(path){
              path.node.declaration.elements = actions
              //path.remove()
            }
          })
          // program.node.body.push(
          //   t.ExportDefaultDeclaration(
          //     t.ArrayExpression(actions)
          //   )
          // )
        }
      },

      ExpressionStatement: function(path){

        if(path.node.expression.type != "Identifier"){
          return
        }

        const actionName = path.node.expression.name
        const handleName = "handle" + actionName.charAt(0).toUpperCase() + actionName.slice(1);
        let successActionName,failureActionName

        if (actionName.endsWith('Request')) {
          successActionName = actionName.replace(/Request$/, 'Success')
          failureActionName = actionName.replace(/Request$/, 'Failure')
        }else{
          successActionName = actionName+"Success"
          failureActionName = actionName+"Failure"
        }

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
                      t.MemberExpression(t.Identifier("api"),t.Identifier(actionName)),
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
                    t.MemberExpression(t.Identifier("actions"),t.Identifier(successActionName)),
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
                        t.identifier("actions"),t.Identifier(failureActionName)
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
            t.Identifier(handleName),
            [t.Identifier("action")],
            t.BlockStatement([
              tryCatch
            ]),
            true
          ),[]
        )
        path.replaceWith(data)
      }
    }
  }
}
