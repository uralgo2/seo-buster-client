import React from 'react'
import {Link} from "react-router-dom";

function Analyze () {
    return (
        <>
            <div className="content">


                <div className="row">
                    <div className="col-sm-4 col-3">
                        <h4 className="page-title">Сайты</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                        <Link to='/analyze/add/project' className="btn btn btn-primary btn-rounded float-right">
                            <i className="fa fa-plus"/>
                            {"     "}
                            Добавить Сайт
                        </Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="table-responsive">
                            <table id="s" className="table table-striped custom-table tasks">
                                <thead>
                                <tr>
                                    <th>Название задачи</th>
                                    <th>Сайт - домен</th>
                                    <th>Город</th>
                                    <th>Дата запуска</th>
                                    <th>Статус</th>

                                </tr>
                                </thead>
                                <tbody>
                                <tr className="s">
                                    <td>ТЕСТ</td>
                                    <td>gazelkin.ru</td>
                                    <td>Москва</td>
                                    <td>2022-06-29</td>
                                    <td>Обновление данных</td>
                                </tr>
                                <tr className="s"
                                    /*onClick="window.location='/?p=site&amp;id=12039&amp;name=&amp;siteMd5=&amp;job_name=Тест Добавление';"*/>
                                    <td>Тест Добавление</td>
                                    <td></td>
                                    <td>Москва</td>
                                    <td>2022-07-04</td>
                                    <td>Готово</td>
                                </tr>
                                <tr className="s">
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>2022-07-19</td>
                                    <td>Обработка</td>
                                </tr>
                                <tr className="s">
                                    <td>проверка</td>
                                    <td></td>
                                    <td>Москва</td>
                                    <td>2022-07-19</td>
                                    <td>Обработка</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>



            </div></>
    )
}
export default Analyze
/*

                <script type="text/javascript">
                    $(document).ready(function () {
                    $("#file_input_id").change(function (e) {
                        var fileName = e.target.files[0].name;
                        $('.ri').html(fileName);
                    });
                    $("#file_input_id2").change(function(e){
                    var fileName = e.target.files[0].name;
                    $('.ri2').html(fileName);
                });
                })
                    ;

                </script>


<script type="text/javascript">
    $(document).ready(function () {
     	   $('#kof').change(function(){
      var y = $(this).val();
      var x = $(this).attr("data-id");
      var z = $(this).attr("data-type");

         $.ajax({
         url: '/upload.php',
         type: 'POST',
         data: {
            id: x, value: y, type: z,
         },
         success: function (result) {
         //   alert(result);
         }
      });

    });

    $('.element').each(function () {
        $mainElement = $(this); // memorize $(this)
        $sibling = $mainElement.next('select'); // find a sibling to $this.

        $sibling.change(function ($mainElement) {
            return function () {
                var x = $(this).attr("data-id");
                var y = $(this).val();
                var x = $(this).attr("data-id");
                var z = $(this).attr("data-type");

                $.ajax({
                    url: '/upload.php',
                    type: 'POST',
                    data: {
                        id: x, value: y, type: z,
                    },
                    success: function (result) {
                        //   alert(result);
                    }
                });
            }
        }($mainElement));
    });

    $('#site').on('change',function(){
    $(this).val($(this).val().replace("https://",""));
    $(this).val($(this).val().replace("www.",""));
    $(this).val($(this).val().replace("/",""));
});

})
    ;
</script>
 */